"""Validate the portfolio and refresh the static release manifest."""
from pathlib import Path
from urllib.parse import urlsplit
import argparse
import hashlib
import ipaddress
import json
import re
import subprocess

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / 'site'
MANIFEST = REPO / 'PORTFOLIO_MANIFEST.json'

def content():
    return json.loads((ROOT / 'content/projects.json').read_text(encoding='utf-8-sig'))

def local_path(value):
    if '\\' in value or '..' in value.split('/') or value.startswith('/'):
        raise ValueError(f'Use a site-relative path: {value}')
    path = (ROOT / value).resolve()
    if not path.is_relative_to(ROOT) or not path.is_file():
        raise ValueError(f'Missing local target: {value}')
    return path

def check():
    for filename in (
        'index.html', 'site.js', 'style.css',
        'assets/fonts/spacegrotesk-regular.woff2', 'assets/fonts/spacegrotesk.woff2',
        'assets/fonts/spacegrotesk-ofl.txt', 'assets/fonts/notosanssc-ofl.txt',
        'portrait/index.html', 'portrait/boot.js', 'portrait/scene.js',
        'portrait/assets/portrait.webp', 'portrait/assets/poster-wide.webp', 'portrait/assets/poster-narrow.webp',
        'portrait/vendor/three.module.js', 'portrait/vendor/THREE-LICENSE.txt',
    ):
        local_path(filename)
    data = content()
    assert data['schemaVersion'] == 1
    assert isinstance(data['site']['showGallery'], bool)
    assert isinstance(data['site']['compactFooter'], bool)
    photo_ids = set()
    for photo in data['site'].get('aboutPhotos', []):
        photo_id = photo['id']
        assert re.fullmatch('[a-z0-9-]+', photo_id) and photo_id not in photo_ids, 'Photo IDs must be unique slugs'
        photo_ids.add(photo_id)
        assert isinstance(photo['alt'], str) and photo['alt'].strip()
        assert all(type(photo[key]) is int and photo[key] > 0 for key in ('width', 'height'))
        local_path(f'assets/about/{photo_id}.webp')
    ids = set()
    for p in data['projects']:
        assert re.fullmatch('[a-z0-9-]+', p['id']) and p['id'] not in ids, 'IDs must be unique slugs'
        ids.add(p['id'])
        for key in ['name', 'summary', 'category', 'stage', 'cover', 'targetUrl', 'intro']:
            assert isinstance(p[key], str) and p[key].strip(), (p['id'], key)
        assert isinstance(p['featured'], bool)
        assert isinstance(p['order'], (int, float)) and not isinstance(p['order'], bool)
        local_path(p['cover'])
        assert p['cover'].endswith(('.webp', '.png', '.jpg', '.svg'))
        for key in ['contribution', 'outcomes', 'limits']:
            assert isinstance(p[key], list) and all(isinstance(s, str) for s in p[key])
        assert isinstance(p['sections'], list) and len(p['sections']) > 0
        assert all(isinstance(s.get('title'), str) and isinstance(s.get('text'), str) for s in p['sections'])
        for value in [p['targetUrl'], *[r['url'] for r in p['resources']]]:
            if value.startswith('#'):
                assert value in ['#home', '#work', '#about'] or value == '#project/' + p['id'], value
            elif value.startswith('https://'):
                u = urlsplit(value)
                assert not u.username and not u.password and u.hostname
                assert u.hostname not in ['localhost'] and not u.hostname.endswith(('.local', '.internal'))
                try:
                    address = ipaddress.ip_address(u.hostname)
                except ValueError:
                    address = None
                if address:
                    assert address.is_global, 'Do not publish internal network targets'
            else:
                local_path(value)
    return data

def runtime_manifest():
    paths = subprocess.check_output(
        ['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', 'site/'], cwd=REPO,
    )
    files = {}
    for name in sorted(paths.decode('utf-8').split('\0')):
        if not name:
            continue
        path = REPO / name
        if path.is_symlink() or not path.resolve().is_relative_to(ROOT):
            raise ValueError(f'Expected a regular file inside site/: {name}')
        if path.is_file():
            files[path.relative_to(ROOT).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return files

def check_manifest(actual):
    expected = json.loads(MANIFEST.read_text(encoding='utf-8'))
    missing = sorted(expected.keys() - actual.keys())
    added = sorted(actual.keys() - expected.keys())
    changed = sorted(name for name in actual.keys() & expected.keys() if actual[name] != expected[name])
    for label, paths in (('Missing', missing), ('Added', added), ('Changed', changed)):
        if paths:
            print(f"{label}: {', '.join(paths)}")
    if missing or added or changed:
        raise SystemExit('Manifest mismatch. Review site/ and run python tools/site.py package.')


def build_fonts(data):
    try:
        from typography.build import ensure_fonts
        import brotli  # Required by fontTools for WOFF2.
    except ModuleNotFoundError as error:
        raise SystemExit('Install font build dependencies with python -m pip install -r tools/typography/requirements.txt') from error
    return ensure_fonts(ROOT, data)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['check', 'fonts', 'package'])
    args = parser.parse_args()
    data = check()

    if args.command in ('fonts', 'package'):
        print(json.dumps(build_fonts(data)))
    if args.command != 'fonts':
        local_path('assets/fonts/notosanssc-site.woff2')
        manifest = runtime_manifest()
        if args.command == 'check':
            check_manifest(manifest)
        elif not MANIFEST.exists() or json.loads(MANIFEST.read_text(encoding='utf-8')) != manifest:
            from typography.build import atomic_write

            release_json = json.dumps(manifest, indent=2, ensure_ascii=False, sort_keys=True) + '\n'
            atomic_write(MANIFEST, release_json.encode('utf-8'))
        print(json.dumps({'projects': len(data['projects']), 'runtimeFiles': len(manifest)}))

"""用标准库打包本地 VS Code 扩展，无须联网安装打包工具。"""
import json
import sys
import zipfile
from pathlib import Path

source = Path(__file__).resolve().parent
manifest = json.loads((source / 'package.json').read_text())
destination = Path(sys.argv[1]) if len(sys.argv) > 1 else source / f"article-template-{manifest['version']}.vsix"
destination.parent.mkdir(parents=True, exist_ok=True)
vsix_manifest = f'''<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="{manifest['name']}" Version="{manifest['version']}" Publisher="{manifest['publisher']}" />
    <DisplayName>{manifest['displayName']}</DisplayName>
    <Description xml:space="preserve">{manifest['description']}</Description>
    <Tags>markdown,template</Tags>
    <Categories>Other</Categories>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="{manifest['engines']['vscode']}" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace" />
    </Properties>
  </Metadata>
  <Installation><InstallationTarget Id="Microsoft.VisualStudio.Code" /></Installation>
  <Dependencies />
  <Assets><Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" /></Assets>
</PackageManifest>'''
content_types = '''<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="cjs" ContentType="application/javascript" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
</Types>'''
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.writestr('extension.vsixmanifest', vsix_manifest)
    archive.writestr('[Content_Types].xml', content_types)
    for name in ['package.json', 'extension.cjs']:
        archive.write(source / name, f'extension/{name}')
print(destination.resolve())

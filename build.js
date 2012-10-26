#!/usr/bin/env node

// 1) validate a zip file argument was supplied
// 2) unzip the zip file using node_appc
// 3) copy the "mobileweb" directory to "tizen"
// 4) remove tizen/templates/app/default/resources/mobileweb directory
// 4) copy tizen files (cli, templates, titanium) on top of "tizen" directory
// 5) copy titanium-sdk/lib/tiappxml.js on top of node_modules/titanium-sdk/lib
// 6) read manifest.json, parse json, add "tizen" to platforms, stringify json, write manifest
// 7) run dependencies.json builder using titanium_mobile/support/mobileweb/dependencyAnalyzer
// 8) re-zip distribution file with "VERSION-tizen.zip"

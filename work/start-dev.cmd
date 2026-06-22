@echo off
set "PATH=C:\Users\Rajat Sharma\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
cd /d "C:\Users\Rajat Sharma\Documents\Codex\2026-06-17\build-a-professional-trading-platform-for"
"C:\Users\Rajat Sharma\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\Rajat Sharma\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs" --config.verify-deps-before-run=false exec next dev --hostname 127.0.0.1 --port 3000 > "work\dev-server.log" 2>&1

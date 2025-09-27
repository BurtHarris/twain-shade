#!/usr/bin/env bash
# POSIX helper to run Vitest development workflow
set -euo pipefail

usage() {
  cat <<EOF
Usage: $(basename "$0") [install|build|dev|test|test:ci|suite <name>]

Commands:
  install    pnpm install
  build      pnpm run build
  dev        pnpm run dev
  test       pnpm run test
  test:ci    pnpm run test:ci
  suite NAME run pnpm run test in test/NAME
EOF
}

if [ $# -lt 1 ]; then
  usage
  exit 1
fi

case "$1" in
  install)
    pnpm install
    ;;
  build)
    pnpm run build
    ;;
  dev)
    pnpm run dev
    ;;
  test)
    pnpm run test
    ;;
  test:ci)
    pnpm run test:ci
    ;;
  suite)
    if [ -z "${2-}" ]; then
      echo "suite name required"
      usage
      exit 1
    fi
    (cd "test/$2" && pnpm run test)
    ;;
  *)
    usage
    exit 1
    ;;
esac

<#
    Vitest development helper (PowerShell)

    Note on 'ni' and global installs
    ---------------------------------
    - Avoid installing the tiny convenience package `ni` globally. Older/global installs
        can pull legacy dependencies which surface deprecation warnings and security
        advisories. Instead prefer one of the following patterns when you need a quick
        command runner:

        * Use the project-local `ni` devDependency (preferred for this repo)
            - Install locally: `npm i -D ni` (already added to this repo's devDependencies)
            - Run from PowerShell (uses local binaries): `npx ni <command>` or
                `npm exec -- ni <command>`

        * Use pnpm's one-shot runner (no global install): `pnpm dlx ni <command>`

        * Use native npm/pnpm scripts instead of relying on a convenience runner.

    Example commands (PowerShell)

    # run the project's `test` script using the local `ni` package
    npm exec -- ni test

    # run a one-off `ni` invocation without installing globally (pnpm)
    pnpm dlx ni test

    This file contains helpers for common developer flows. The script itself will
    continue to call `pnpm` for install/build/test steps so you don't need a
    global `ni` to use it.
#>
# PowerShell helper to run Vitest development workflow
param(
    [switch]$Install,
    [switch]$Build,
    [switch]$Dev,
    [switch]$Test,
    [switch]$TestCI,
    [string]$Suite
)

if ($Install) {
    Write-Host "Running pnpm install..."
    pnpm install
}

if ($Build) {
    Write-Host "Building all packages..."
    pnpm run build
}

if ($Dev) {
    Write-Host "Starting watch/dev build..."
    pnpm run dev
}

if ($Test) {
    Write-Host "Running core tests..."
    pnpm run test
}

if ($TestCI) {
    Write-Host "Running full CI suite..."
    pnpm run test:ci
}

if ($Suite) {
    Write-Host "Running specific suite: $Suite"
    Push-Location "test\$Suite"
    pnpm run test
    Pop-Location
}

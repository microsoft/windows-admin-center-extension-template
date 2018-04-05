<#

.SYNOPSIS
Create PR for each level of repo by updating reference package with latest version.

.DESCRIPTION
Create PR for each level of repo by updating reference package with latest version.

.EXAMPLE
.\New-PRWithLatestPackageReference.ps1 -Level 1 -PAT {Your Personal Access Token}


#>

Param(
    [System.UInt32]$Level,
    [System.String]$PAT = $null
)

$Repos = @()

switch ($level) {
    1 {
        ## level 1 set
        $Repos = @(
            "msft-sme-event-viewer", 
            "msft-sme-file-explorer",
            "msft-sme-local-users-groups"
        )
    }
    2 {
        ## level 2 set
        $Repos = @(
            "msft-sme-process-viewer",
            "msft-sme-extension-manager",
            "msft-sme-firewall",
            "msft-sme-network-settings",
            "msft-sme-powershell-console",
            "msft-sme-registry-editor",
            "msft-sme-roles-features",
            "msft-sme-windows-update",
            "msft-sme-remote-desktop"
        )    
    }
    3 {
        ## level 3 set
        $Repos = @(
            "msft-sme-storage",
            "msft-sme-service-viewer",
            "msft-sme-device-manager",
            "msft-sme-server-manager",
            "msft-sme-certificate-manager",
            "msft-sme-hyperv",
            "msft-sme-failover-cluster"
        )
    }
    4 {
        ## level 4 set // no longer needed.
        $Repos = @(
        )
    }
}

Write-Host "Level" $level $repos

$config = @{
    Repos           = $Repos
    Updates         = @(
        @{
            Name       = "@msft-sme/shell"
            Version    = "0.0.0"
            AutoUpdate = $true
        },
        @{
            Name       = "@msft-sme/event-viewer"
            Version    = "0.0.0"
            AutoUpdate = $true
        },
        @{
            Name       = "@msft-sme/file-explorer"
            Version    = "0.0.0"
            AutoUpdate = $true
        },
        @{
            Name       = "@msft-sme/storage"
            Version    = "0.0.0"
            AutoUpdate = $true
        },
        @{
            Name       = "@msft-sme/local-users-groups"
            Version    = "0.0.0"
            AutoUpdate = $true
        },
        @{
            Name       = "@msft-sme/build"
            Version    = "0.0.0"
            AutoUpdate = $true
        },
        @{
            Name       = "@angular/cli"
            Version    = "1.6.7"
            AutoUpdate = $false
        },
        @{
            Name       = "chart.js"
            Version    = "2.4.0"
            AutoUpdate = $false
        }
    )
    WorkingFolder   = "repos"
    SourceBranch    = "user/build/pr"
    Key             = $env:SYSTEM_ACCESSTOKEN
    RefreshLockFile = $false
}

# if PAT is provided, then use PAT auth header, otherwise, use System auth token, make sure we encode the Personal Access Token (PAT) appropriately
$authHeader = "";
if(![string]::IsNullOrEmpty($PAT)) {    
    $encodedPat = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(":$PAT"))
    $authHeader = "Basic {0}" -f $encodedPat
} else {
    $authHeader = "bearer $($config.Key)"
}

Write-Host $authHeader

$matchPattern = '\d+\.\d+\.\d+'
foreach ($update in $config.Updates) {
    if ($update.AutoUpdate) {
        $name = $update.Name
        $line = npm view $name | Where-Object {$_.Contains("version:")}
        $match = [Regex]::Match($line, $matchPattern)
        if ($match.Success) {
            $update.Version = $match.Value
            Write-Host $update.Name $update.Version
        }
    }
}

## managing a working folder
$parentPath = (get-item .).Parent.FullName
$workingPath = [System.IO.Path]::Combine($parentPath, $config.WorkingFolder)
if (Test-Path $workingPath) {
    throw "Working folder shouldn't be present"
}

mkdir $workingPath

foreach ($repo in $config.Repos) {
    Set-Location $workingPath
    $updated = ""
    ## clone
    $param1 = "http.extraheader=""AUTHORIZATION: $($authHeader)"""
    $param2 = "https://microsoft.visualstudio.com/DefaultCollection/SME/_git/$repo"
    $param1
    $param2
    & git -c $param1 clone $param2 2>stderr.txt
    get-content stderr.txt
    Set-Location $repo
    vsts-npm-auth -config .npmrc

    ## update package number
    $content = get-content .\package.json
    for ($i = 0; $i -lt $content.Count; $i++) {
        $line = $content[$i]
        foreach ($update in $config.Updates) {
            $name = """" + $update.Name + """"
            if ($line.Contains($name)) {
                $updatedLine = $line -replace "\d+\.\d+\.\d+", $update.Version;
                if ($content[$i] -ne $updatedLine) {
                    $content[$i] = $updatedLine;
                    $add = $update.Name + "@" + $update.Version + " "
                    if (-not $updated.Contains($add)) {
                        $updated += $add
                    }
                }
            }
        }
    }

    if ($updated -ne "") {
        Set-Content -Encoding UTF8 -Path .\package.json $content
        if ($config.RefreshLockFile) {
            Remove-Item .\package-lock.json
        }
        npm install 2>stderr.txt
        get-content stderr.txt

        if (Test-Path .\package-lock.json) {
            git add package.json package-lock.json 2>stderr.txt
            get-content stderr.txt
            $commitMessage = "Update package.json: " + $updated
            git commit -m "$commitMessage"
            $sourceBranch = "HEAD:" + $config.SourceBranch
            &git -c $param1 push origin "$sourceBranch" 2>stderr.txt
            get-content stderr.txt
            $uri = "https://microsoft.visualstudio.com/DefaultCollection/SME/_apis/git/repositories/$repo/pullRequests"
            $bodyJson = @{
                title         = "[Auto] Update package.json: " + $updated
                sourceRefName = "refs/heads/" + $config.SourceBranch
                targetRefname = "refs/heads/master"
                reviewers     = @(@{ id = "baca6c94-cb91-4fce-b2c6-04cb948f9095" })
                description   = "No functional test is done, carefully review to approve the change."
            }
            $body = ConvertTo-Json -Compress $bodyJson
            $headers = @{
                Accept        = "application/json;api-version=4.1-preview.1"
                Authorization = $authHeader
            }
            Invoke-RestMethod -uri $uri -ContentType "application/json" -Method Post -Body $body -Headers $headers
        }
        else {
            Write-Error "Unable to complete npm install, manual handling is required."
        }
    }
}
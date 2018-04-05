<#

.SYNOPSIS
Retrieves the inventory data for a server.

.DESCRIPTION
Retrieves the inventory data for a server.

.ROLE
Readers

#>

import-module CimCmdlets

$isAdministrator = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
$operatingSystem = Get-CimInstance Win32_OperatingSystem
$computerSystem = Get-CimInstance Win32_ComputerSystem

$computerName = $computerSystem.DNSHostName
if ($computerName -eq $null) {
    $computerName = $computerSystem.Name
}

$fqdn = ([System.Net.Dns]::GetHostEntry($computerName)).HostName
$namespaces = Get-CimInstance -Namespace root/microsoft/windows -ClassName __NAMESPACE
$managementToolsAvailable = ($namespaces | Where-Object { $_.Name -ieq "ManagementTools" -or $_Name -ieq "ManagementTools2" }) -ne $null
$serverManagerAvailable = ($namespaces | Where-Object { $_.Name -ieq "ServerManager" }) -ne $null
$isCluster = $false
$clusterFqdn = $null

$isWmfInstalled = $false

$operatingSystemVersion = $OperatingSystem.Version;
$windows2016Version = [Version]'10.0';
$windows2012Version = [Version]'6.2';

if ($operatingSystemVersion -ge $windows2016Version) {
    # It's okay to assume that 2016 and up comes with WMF 5 or higher installed
    $isWmfInstalled = $true;
}
elseif ($operatingSystemVersion -ge $windows2012Version) {
    # Windows 2012/2012R2 are supported as long as WMF 5 or higher is installed
    $registryKey = 'HKLM:\SOFTWARE\Microsoft\PowerShell\3\PowerShellEngine';
    $registryKeyValue = Get-ItemProperty -Path $registryKey -Name PowerShellVersion -ErrorAction SilentlyContinue;
    if ($registryKeyValue -and ($registryKeyValue.Length -ne 0)) {
        $installedWmfVersion = [Version]$registryKeyValue.PowerShellVersion;
        if ($installedWmfVersion -ge [Version]'5.0') {
            $isWmfInstalled = $true;
        }
    }
}

# JEA code requires to pre-import the module (this is slow on failover cluster environment.)
Import-Module FailoverClusters -ErrorAction SilentlyContinue
$failoverClusters = Get-Module FailoverClusters -ErrorAction SilentlyContinue
$isTsdbEnabled = $failoverClusters -ne $null -and $failoverClusters.ExportedCommands.ContainsKey("Get-ClusterPerformanceHistory")

# quicker way to find the module existence. it doesn't load the module.
$isHyperVPowershellInstalled = !!(get-module -ListAvailable Hyper-V)

$vmmsService = Get-Service -Name "VMMS" -ErrorAction SilentlyContinue;
$isHyperVRoleInstalled = $vmmsService -and $vmmsService.Name -eq "VMMS"

try {
    $cluster = Get-CimInstance -Namespace root/mscluster MSCluster_Cluster -ErrorAction Stop
    $isCluster = $true
    $clusterFqdn = $cluster.fqdn
}
catch {
    ## ignore if namespace is not available.
}

$result = New-Object PSObject
$result | Add-Member -MemberType NoteProperty -Name 'IsAdministrator' -Value $isAdministrator
$result | Add-Member -MemberType NoteProperty -Name 'OperatingSystem' -Value $operatingSystem
$result | Add-Member -MemberType NoteProperty -Name 'ComputerSystem' -Value $computerSystem
$result | Add-Member -MemberType NoteProperty -Name 'Fqdn' -Value $fqdn
$result | Add-Member -MemberType NoteProperty -Name 'IsManagementToolsAvailable' -Value $managementToolsAvailable
$result | Add-Member -MemberType NoteProperty -Name 'IsServerManagerAvailable' -Value $serverManagerAvailable
$result | Add-Member -MemberType NoteProperty -Name 'IsCluster' -Value $isCluster
$result | Add-Member -MemberType NoteProperty -Name 'ClusterFqdn' -Value $clusterFqdn
$result | Add-Member -MemberType NoteProperty -Name 'IsWmfInstalled' -Value $isWmfInstalled
$result | Add-Member -MemberType NoteProperty -Name 'IsTsdbEnabled' -Value $isTsdbEnabled
$result | Add-Member -MemberType NoteProperty -Name 'IsHyperVRoleInstalled' -Value $isHyperVRoleInstalled
$result | Add-Member -MemberType NoteProperty -Name 'IsHyperVPowershellInstalled' -Value $isHyperVPowershellInstalled
$result

<#

.SYNOPSIS
Retrieves the inventory data for a cluster.

.DESCRIPTION
Retrieves the inventory data for a cluster.

.ROLE
Readers

#>

import-module CimCmdlets

# JEA code requires to pre-import the module (this is slow on failover cluster environment.)
import-module FailoverClusters -ErrorAction SilentlyContinue

$computerSystem = Get-CimInstance Win32_ComputerSystem
$computerName = $computerSystem.DNSHostName
if ($computerName -eq $null) {
    $computerName = $computerSystem.Name
}

## check if cluster cmdlets are installed on this node
$isClusterCmdletAvailable = $false;
if (Get-Command "Get-Cluster" -ErrorAction SilentlyContinue) {
    $isClusterCmdletAvailable = $true;
}

## get cluster info
$cluster = Get-CimInstance -Namespace root/mscluster MSCluster_Cluster
$clusterFqdn = $cluster.fqdn

$isS2dEnabled = $false
if ($cluster.S2DEnabled -eq 1) {
    $isS2dEnabled = $true
}

## check if cluster health cmdlet available on the cluster
$isClusterHealthCmdletAvailable = $false
if (Get-Command -Name "Get-HealthFault" -ErrorAction SilentlyContinue) {
    $isClusterHealthCmdletAvailable = $true
}

## check if britannica (sddc management resources) are available on the cluster
$isBritannicaEnabled = $false;
if (Get-CimInstance -Namespace root/sddc -ClassName __NAMESPACE -ErrorAction SilentlyContinue) {
    $isBritannicaEnabled = $true
}

$result = New-Object PSObject
$result | Add-Member -MemberType NoteProperty -Name 'Fqdn' -Value $clusterFqdn
$result | Add-Member -MemberType NoteProperty -Name 'IsS2DEnabled' -Value $isS2dEnabled
$result | Add-Member -MemberType NoteProperty -Name 'IsClusterHealthCmdletAvailable' -Value $isClusterHealthCmdletAvailable
$result | Add-Member -MemberType NoteProperty -Name 'IsBritannicaEnabled' -Value $isBritannicaEnabled
$result | Add-Member -MemberType NoteProperty -Name 'IsClusterCmdletAvailable' -Value $isClusterCmdletAvailable
$result | Add-Member -MemberType NoteProperty -Name 'CurrentClusterNode' -Value $computerName
$result

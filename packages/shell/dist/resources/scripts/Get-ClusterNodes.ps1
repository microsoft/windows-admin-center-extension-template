<#

.SYNOPSIS
Retrieves the inventory data for cluster nodes in a particular cluster.

.DESCRIPTION
Retrieves the inventory data for cluster nodes in a particular cluster.

.ROLE
Readers

#>

import-module CimCmdlets

# JEA code requires to pre-import the module (this is slow on failover cluster environment.)
import-module FailoverClusters -ErrorAction SilentlyContinue

$cmdletInfo = Get-Command 'Get-ClusterNode' -ErrorAction SilentlyContinue
$isClusterCmdletAvailable = ($cmdletInfo -and $cmdletInfo.Name -eq "Get-ClusterNode")

if ($isClusterCmdletAvailable) {
    $clusterNodes = Get-ClusterNode | Select-Object DrainStatus, DynamicWeight, Name, NodeWeight, FaultDomain, State -ErrorAction SilentlyContinue
}

if ($clusterNodes -eq $null) {
    $clusterNodes = Get-CimInstance -Namespace root/mscluster MSCluster_Node -ErrorAction Stop
}

$clusterNodeMap = @{}

foreach ($clusterNode in $clusterNodes) {
    $clusterNodeName = $clusterNode.Name
    if ($clusterNode -ne $null) {
        $clusterNodeName = $clusterNodeName.ToLower()
    }

    $clusterNodeFqdn = $null

    $preference = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    $clusterNodeFqdn = ([System.Net.Dns]::GetHostEntry($clusterNodeName)).HostName
    $ErrorActionPreference = $preference

    if ($clusterNodeFqdn) {
      $clusterNodeResult = New-Object PSObject
      $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'FullyQualifiedDomainName' -Value $clusterNodeFqdn
      $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'Name' -Value $clusterNodeName
      $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'DynamicWeight' -Value $clusterNode.DynamicWeight
      $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'NodeWeight' -Value $clusterNode.NodeWeight
      $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'FaultDomain' -Value $clusterNode.FaultDomain
      $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'State' -Value $clusterNode.State

      if ($isClusterCmdletAvailable) {
          $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'DrainStatus' -Value $clusterNode.DrainStatus
      }
      else {
          $clusterNodeResult | Add-Member -MemberType NoteProperty -Name 'DrainStatus' -Value $clusterNode.NodeDrainStatus
      }

      $clusterNodeMap.Add($clusterNodeName, $clusterNodeResult)
    }
}

$clusterNodeMap

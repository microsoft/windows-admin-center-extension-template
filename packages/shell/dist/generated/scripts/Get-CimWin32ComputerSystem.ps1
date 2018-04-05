<#

.SYNOPSIS
Gets Win32_ComputerSystem object.

.DESCRIPTION
Gets Win32_ComputerSystem object.

.ROLE
Readers

#>


import-module CimCmdlets

Get-CimInstance -Namespace root/cimv2 -ClassName Win32_ComputerSystem

# Windows Admin Center CLI #

The Windows Admin Center CLI was created to simplify the process of generating new tools for the platform.

## Usage ##

There is only one command for the CLI, "Create".  In order to create a new tool, type the following:

```
wac create --company <Your Company Name> --tool<Your Tool Name>
```
For instance, when creating a tool called Foo for Microsoft, my command would be:

```
wac create --company Microsoft --tool Foo
```

You can also use the CLI to create solution extensions as well:

```
wac create --company Microsoft --tool Foo --solution MySolution
```

In addition to creating extensions, you can specify which version of the SDK you want to utilize.  There are 3 rings for you to choose from:

* latest (the most current GA release, 2 updates per year)
* insider (build most recently released to Insiders.  Updates monthly)
* next (current dev build.  Updates frequently, up to weekly)

In order to specify which SDK version you want to use, add the version tag to the create command:

```
wac create --company Microsoft --tool Foo --version insider
```

Default value is latest.


## Get started with the SDK ##

Getting started with Windows Admin Center development is easy!  Follow along with [step-by-step directions](https://docs.microsoft.com/windows-server/manage/windows-admin-center/extend/prepare-development-environment) to prepare your environment, and learn more about writing and publishing extensions at our [documentation site](http://aka.ms/WindowsAdminCenter).

Don't have Windows Admin Center installed yet?  [Download](http://aka.ms/WindowsAdminCenter) Windows Admin Center.

## Contributing ##

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

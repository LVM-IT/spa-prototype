# Azure Auto Deployment

The prototype supports azure auto deployment. Azure Websites will automatically detect our Node.js app and install required packages listed in `dependencies`, `devDependencies` will not be installed on Azure machines.

By default Azure will always render the `LAS-Root` application. This behaviour can be changed by using the `LVM_APP` environment variable.

## Idea

There should be two websites for each branch you want to host on Azure.

 * WebApp1 for `LAS-Root`
 * WebApp2 for `LVM-Contract-App`

## Configuration

Configure continuous deployment using Azure's GitHub integration feature and select the same branch for both **WebApp1** and **WebApp2**.

**Currently all code is only hosted in the** `develop` **branch**

### Protection

You can overwrite the default password for web access by setting a `LVM_PASSWD` environment variable.


## WebApp1 (LAS-Root)

Keep Azure default configuration as is. After all deployment jobs were finished for WebApp1, you should be able to access `LAS-Root` by browsing WebApp1's public URL.

## WebApp2 (LVM-Contract-App)

Provide the following environment variable utilising Azure's Configuration Interface for WebApp2

|Variable Name|Variable Value|
|-------------|--------------|
|LVM_APP|src-contract-app|

After you've specified the environment variable and all deployment tasks were finished, restart the Web Application to ensure a clean state. When browsing to WebApp2's public URL, you should now see `LVM-Contract-App`

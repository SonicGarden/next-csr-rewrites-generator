# next-csr-firebase-rewrites-generator

Deploy helper command to generate rewrite rules for Next.js CSR application

# Installation

<pre>
yarn add @sonicgarden/next-csr-rewrites-generator
</pre>

# Usage

Add this command to your deployment script (The following is for deploying to firebase hosting)

package.json:
<pre>
"scripts": {
  "deploy": "next build && next export && <strong>next-csr-rewrites-generate -f firebase</strong> && firebase deploy"
}
</pre>

# Generated hosting rewrite rules

When the following files exist in the deploy directory

```
/hoge/[hogeId].html
/fuga/[fugaId].html
```

The following rewrite rules will be added to firebase.json (cleanUrls will be added together)

```
{
  "hosting": {
    "rewrites": [
      {
        "source": "/hoge/:hogeId",
        "destination": "/hoge/[hogeId].html"
      },
      {
        "source": "/fuga/:fugaId",
        "destination": "/fuga/[fugaId].html"
      }
    ],
    "cleanUrls": true
  }
}
```

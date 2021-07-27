# next-csr-firebase-rewrites-updater

Deploy helper command to update firebase hosting rewrites for Next.js CSR application

# Installation

<pre>
yarn add @sonicgarden/next-csr-firebase-rewrites-updater
</pre>

# Usage

Add this command to your deployment script

pakcage.json:
<pre>
"scripts": {
  "deploy": "next build && next export && <strong>next-csr-firebase-rewrites-updater</strong> && firebase deploy"
}
</pre>

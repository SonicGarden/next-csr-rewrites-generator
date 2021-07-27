# next-csr-firebase-rewrites-generator

Deploy helper command to generate firebase hosting rewrites for Next.js CSR application

# Installation

<pre>
yarn add @sonicgarden/next-csr-firebase-rewrites-generator
</pre>

# Usage

Add this command to your deployment script

pakcage.json:
<pre>
"scripts": {
  "deploy": "next build && next export && <strong>next-csr-firebase-rewrites-generator</strong> && firebase deploy"
}
</pre>

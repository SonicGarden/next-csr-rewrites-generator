# next-csr-rewrites-generator

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
  "deploy": "next build && next export && <strong>next-csr-rewrites-generate --format firebase</strong> && firebase deploy"
}
</pre>
Note: of course, you can alos run this command manually!

# Command usage

<pre>
next-csr-rewrites-generate

  Deploy helper command to generate rewrite rules for Next.js CSR application 

Options

  -f, --format firebase   Format type                                                           
  -o, --output filepath   Output file path. (If omitted, the original file will be overwritten) 
  -h, --help              Show usage 
</pre>

# Generated hosting rewrite rules

When the following files exist in the deploy directory

<pre>
index.html
hoge/[hogeId].html
fuga/[fugaId].html
</pre>

The following rewrite rules will be added to firebase.json (cleanUrls will be added together)

<pre>
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
</pre>
Note: rewrite rules other than dynamic routing will not be updated.

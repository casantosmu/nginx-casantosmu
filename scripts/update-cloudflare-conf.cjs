#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

(async () => {
  const ipVersions = ["v4", "v6"];
  const responses = await Promise.all(
    ipVersions.map(async (version) => {
      const url = `https://www.cloudflare.com/ips-${version}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network response for ${url} was not OK`);
      }
      const text = await response.text();
      console.log(`Response from ${url}:\n${text}`);
      return text;
    }),
  );

  const [ipsV4, ipsV6] = responses.map(
    (response) =>
      "set_real_ip_from " +
      response.replaceAll("\n", ";\nset_real_ip_from ") +
      ";",
  );

  const content = `## Cloudflare Real IP visitors ##

# IP v4
${ipsV4}

# IP v6
${ipsV6}

real_ip_header CF-Connecting-IP;
`;

  const filePath = path.join(__dirname, "..", "conf.d", "cloudflare.conf");

  await fs.writeFile(filePath, content);
  console.log("cloudflare.conf file updated successfully.");
})();


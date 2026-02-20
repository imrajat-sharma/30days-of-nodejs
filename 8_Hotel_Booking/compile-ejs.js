const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const tpl = fs.readFileSync(
  path.join(__dirname, "views", "listings.ejs"),
  "utf8",
);

function tryCompile(name, source, opts = {}) {
  try {
    ejs.compile(
      source,
      Object.assign(
        { filename: path.join(__dirname, "views", "listings.ejs") },
        opts,
      ),
    );
    console.log(`[OK] ${name}`);
    return true;
  } catch (err) {
    console.error(`[ERR] ${name}: ${err.message}`);
    return false;
  }
}

console.log("Attempting incremental compile checks...");
tryCompile("full template", tpl);

// remove includes
const noNav = tpl.replace(/<%-?\s*include\([^\)]*\)\s*%>/g, "");
tryCompile("without includes", noNav);

// remove any <% %> scriptlets entirely
const noScriptlets = noNav.replace(/<%[\s\S]*?%>/g, "");
tryCompile("without any scriptlets", noScriptlets);

// minimal test
tryCompile("minimal empty template", "Hello");

console.log("Done.");

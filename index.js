const { exec } = require("child_process");
const { tmpName } = require("tmp");
const { promisify } = require("util");
const fs = require("fs");

module.exports = function (content) {
	let callback = this.async();
	let resourcePath = this.resourcePath;
	tmpName({ postfix: ".js" }, (err, path) => {
		if (err) return callback(err);
		exec("emcc " + resourcePath + " -o " + path, (err, stdout, stderr) => {
			if (err) return callback(err);
			fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
				if (err) return callback(err);
				data += "\nexport default Module;"
				fs.unlink(path, (err) => { });
				callback(null, data);
			})
		});
	})
}

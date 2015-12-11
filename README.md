# cleancode
A script which helps to automate, cleanup your code by removing all console.* methods, commented codes, empty lines and beautify code with the help of js-neautify npm module.
This script will cover all JS files in specified folder and will do the following tasks.

1.	Remove all console.* methods.
2.	Remove all single/multi line comments.
3.	Remove all empty lines.
4.	Indent code with two spaces, as suggested in coding standard document.

######Known Issues:

While removing statements ends with ';'.
If not, it will look for the next ';', and removes the code until there.

**Command to execute:** node clean.js

**Dependency:** js-beautify (npm install js-beautify)




# vike-reproduction-issue-1580
A package reproduction for the following issue: https://github.com/vikejs/vike/issues/1580 

Steps:
```
# clone this repo
git clone https://github.com/Jearce/vike-reproduction-issue-1580.git
cd vike-reproduction-issue-1580

pnpm install vike@0.4.150
# should print out the application's routes
node server

# upgrade to latest
pnpm install vike@latest
# should output the bug error this issue is for
node server
```

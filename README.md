# vike-reproduction-issue-1580
A package reproduction for the following issue: https://github.com/vikejs/vike/issues/1580 

Steps:
```
# Clone this repo.
git clone https://github.com/Jearce/vike-reproduction-issue-1580.git
cd vike-reproduction-issue-1580

# Install dependencies.
pnpm install
# The following should output the error this issue is for.
node server

# Note that we can install 0.4.150 and start the server with the app's routes printed.
pnpm install vike@0.4.150
node server
```

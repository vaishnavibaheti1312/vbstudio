## Local Development

### Start the server
```bash
python3 -m http.server 8080
```
Open http://localhost:8080 in your browser.

### Stop the server
Press `Ctrl + C` in the terminal where the server is running.

Or, to force-kill it from any terminal:
```bash
lsof -ti:8080 | xargs kill -9
```

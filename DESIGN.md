* curl to json
 * the input curl will look like 
```
curl https://www.google.com
```
 * the output json will look like
```
{
  "command": "curl",
  "uri": "https://www.google.com"
}
```
* json to tree
 * supported input looks like
```
{
  "team": {
    "name": "Clearview",
    "topic": "anything outside of work",
    "description": "This is a slack team",
  }
}
```
```
{
  "team": {
    "name": "Zoo Keepers",
    "motto": "Protector of the animals",
    "description": "This is a slack team for people who work at a zoo",
    "botuser": {
      "name": "chatty the reporter",
      "nickname": "@chatty",
      "control": {
        "": 
      }
    },
    "channels": [{
        "name": "general"
      }, { 
        "name": "animal-alarm"
    }],
    "users": [{
      "name": "mars",
      "nickname": "@mars",
      "conversation": [{
        "from": "@mars",
        "to": "@chatty",
        "text": "hi there",
        "previous": null,
        "next": null,
        "id": 1
      }, {
        "from": "@chatty",
        "to": "@mars",
        "text": "I am good",
        "previous": 1,
        "next": null,
        "id": 2
      }]
    }, {
      "name": "nshimiye"
    }]
  }
}
```
 * output looks like
```
{
  "name": "team",
  "parent": null,
  "direct-children": {
    "name": "Zoo Keepers",
  },
  "children": [{
    "name": "botuser",
    "parent": "team",
    "direct-children": {
      "name": "chatty the reporter",
      "nickname": "@chatty"
    }
  }, {
    "name": "users",
    "parent": "team",
    "direct-children": {
      // no direct children for arrays
    },
    "children": [{
      "name": "users-1",
      "parent": "users",
      "direct-children": {
        "name": "mars",
      },
      "children": [{
        "name": "conversation",
        "parent": "user-1",
        "direct-children": {
          // no direct children for arrays
        },
        "children": [{
          "name": "conversation-1"
          "parent": "conversation",
          "direct-children": {
            "from": "@mars",
            "to": "@chatty",
            "text": "hi there",
            "previous": null,
            "next": null,
            "id": 1
          },
          "children": [
            // no children
          ]
        }, {
          "name": "conversation-2"
          "parent": "conversation",
          "direct-children": {
            "from": "@chatty",
            "to": "@mars",
            "text": "I am good",
            "previous": 1,
            "next": null,
            "id": 2          
          },
          "children": [
            // no children
          ]
        }]
      }, {
        
      }]
    }, {
      "name": "users-2",
      "parent": "users",
      "direct-children": {
        "name": "nshimiye",
      },
      "children": []
    }] 
  }]
}
```

{
  "targets": [
    {
      "target_name": "fstime",
      "conditions": [
      	["OS=='linux'", {
      	  "sources": [ "src/fstime.cc" ]
        }]
      ]
    }
  ]
}

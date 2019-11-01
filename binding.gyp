{
  "targets": [
    {
      "target_name": "fstime",
      "conditions":[
      	["OS=='linux'", {
      	  "sources": [ "src/fstime-napi.cc" ]
        }],
      ], 
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}

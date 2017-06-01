{
  "targets": [
    {
      "target_name": "fstime",
      'sources': [
          'src/fstime.cc',
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}

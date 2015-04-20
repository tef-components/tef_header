module.exports = function(grunt) {
  require('jit-grunt')(grunt,{
    replace: 'grunt-text-replace'
  });

  grunt.initConfig({
    less: {
      default: {
        files: {
          "templates/tef.header.css": "less/tef.header.less"
        }
      }
    },

    includes: {
      files: {
        cwd: 'templates/',
        src: '**/*.html',
        dest: ''
      }
    },
    replace: {
      firstReplacement: {      
        src: ['tef_header_styles.html'],
        overwrite: true,
        replacements: [{
          from: '::content .tef-header',
          to: '.tef-header ::content'
        },{
          from: 'url(../images/bg.jpg)',
          to: '{{g.headerBg}}'
        },{
          from: 'url(../images/logo.png)',
          to: '{{g.headerLogo}}'
        }]
      }
    },

    bump: {
      // upgrade release and push to master
      options : {
        files: ['bower.json'],
        commitFiles: ["-a"],
        pushTo: 'origin'
      }
    },

    exec: {
      // add new files before commiting
      add: {
        command: 'git add .'
      },

      // push to gh-pages branch
      pages: {
        command: [
          'git checkout gh-pages',
          'git pull origin master',
          'git push origin gh-pages',
          'git checkout master'
        ].join('&&')
      },

      // adds prompted commit message
      message: {
        command: function() {
          var message = grunt.config('gitmessage');
          return "git commit -am '" + message + "'";
        }
      }
    },

    prompt: {
      commit: {
        options: {
          questions: [
            {
              config: 'gitmessage',
              type: 'input',
              message: 'Commit Message'
            }
          ]
        }
      }
    }
  });

  grunt.registerTask('default', [
    'less',
    'includes',
    'replace'
  ]);

  grunt.registerTask('release', [
    'less',
    'includes',
    'exec:add',
    'prompt',
    'exec:message',
    'bump',
    'exec:pages'
  ]);
};

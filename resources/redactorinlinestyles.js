if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.inlinestyles = function()
{
  return {
    buttonsAdd: null,
    buttonsAddAfter: null,
    setIcons: null,
    iconsFile: null,

    init: function()
    {
      this.inlinestyles.buttonsAdd = this.inlinestyles.getConfig('buttonsAdd').reverse();
      this.inlinestyles.buttonsAddAfter = this.inlinestyles.getConfig('buttonsAddAfter');
      this.inlinestyles.setIcons = this.inlinestyles.getConfig('setIcons');
      this.inlinestyles.iconsFile = RedactorInlineStyles.config.iconsFile;

      // Add buttons and dropdowns
      this.inlinestyles.addButtons();

      // Set (additional) button icons
      this.inlinestyles.changeButtonIcons();
    },

    addButtons: function()
    {
      $.each(this.inlinestyles.buttonsAdd, $.proxy(function(i, s)
      {
        var pos = 'addAfter' in s ? s.addAfter : this.inlinestyles.buttonsAddAfter;
        var id = this.inlinestyles.createClassName(s.title);

        var btn = this.button.addAfter(pos, id, Craft.t(s.title));

        if ('icon' in s)
        {
          this.button.setIcon(btn, this.inlinestyles.getIconHtml(s.icon));
        }

        if (!('dropdown' in s))
        {
          this.button.addCallback(btn, function() {
            this.inlinestyles.applyFormat(s.args, s.clear);
          });
        }
        else
        {
          var dropdown = {};

          $.each(s.dropdown, $.proxy(function(o, g) {
            var key = this.inlinestyles.createClassName(g.title);

            dropdown[key] = {
              title: Craft.t(g.title),
              func: function() {
                this.inlinestyles.applyFormat(g.args, g.clear);
              }
            };
          }, this));

          this.button.addDropdown(btn, dropdown);
        }
      }, this));
    },

    applyFormat: function(args, clear)
    {
      if (clear)
      {
        this.inline.removeFormat();
      }

      if (typeof args !== 'undefined')
      {
        var type = (this.utils.isBlockTag(args[0])) ? 'block' : 'inline';

        switch(args.length)
        {
          case 1: this[type].format(args[0]); break;
          case 2: this[type].format(args[0], args[1]); break;
          case 3: this[type].format(args[0], args[1], args[2]); break;
          case 4: this[type].format(args[0], args[1], args[2], args[3]); break;
          default: throw new Error('Illegal argument count');
        }
      }
    },

    changeButtonIcons: function()
    {
      if (this.inlinestyles.setIcons !== null)
      {
        setTimeout($.proxy(function()
        {
          $.each(this.button.all(), $.proxy(function(i, s)
          {
              var key = $(s).attr('rel');
              var iconId = this.inlinestyles.setIcons[key];

              if (typeof iconId !== 'undefined')
              {
                  var button = this.button.get(key);
                  this.button.setIcon(button, this.inlinestyles.getIconHtml(iconId));
              }
          }, this));
        }, this), 0);
      }
    },

    createClassName: function(str)
    {
      return str.replace(/[^a-zA-Z]/g, '').toLowerCase();
    },

    getIconHtml: function(id)
    {
      return '<svg class="re-button-icon">' +
        '<use xlink:href="'+this.inlinestyles.iconsFile+'#'+id+'"></use>' +
        '</svg>';
    },

    getConfig: function(s)
    {
      return s in this.opts ? this.opts[s] : RedactorInlineStyles.config[s];
    },

  };
};

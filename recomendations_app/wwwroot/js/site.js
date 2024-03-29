﻿storage = window.localStorage

const theme = () => {
    document.querySelector("body").setAttribute("data-bs-theme", "dark");
    document.querySelector("#dl-icon").setAttribute("class", "bi bi-sun-fill");
    storage.setItem('theme','dark');
}

const themeLight = () => {
    document.querySelector("body").setAttribute("data-bs-theme", "light");
    document.querySelector("#dl-icon").setAttribute("class", "bi bi-moon-fill");
    storage.setItem('theme', 'light');
}

const switchTheme = () => {
    if (document.querySelector("body").getAttribute("data-bs-theme") === "light") {
        theme();
        console.log("light");
    } else {
        themeLight();
        console.log("dark");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if (storage.getItem('theme') === "light") {
        themeLight();
    } else {
        theme();
    }
});

(function () {

    "use strict"


    // Plugin Constructor
    var TagsInput = function (opts) {
        this.options = Object.assign(TagsInput.defaults, opts);
        this.init();
    }

    // Initialize the plugin
    TagsInput.prototype.init = function (opts) {
        this.options = opts ? Object.assign(this.options, opts) : this.options;

        if (this.initialized)
            this.destroy();

        if (!(this.orignal_input = document.getElementById(this.options.selector))) {
            console.error("tags-input couldn't find an element with the specified ID");
            return this;
        }

        this.arr = [];
        this.wrapper = document.createElement('div');
        this.input = document.createElement('input');
        init(this);
        initEvents(this);

        this.initialized = true;
        return this;
    }

    // Add Tags
    TagsInput.prototype.addTag = function (string) {

        if (this.anyErrors(string))
            return;

        this.arr.push(string);
        var tagInput = this;

        var tag = document.createElement('span');
        tag.className = this.options.tagClass;
        tag.innerText = string;
        tag.setAttribute('name','Tags');
        

        var closeIcon = document.createElement('a');
        closeIcon.innerHTML = '&times;';

        // delete the tag when icon is clicked
        closeIcon.addEventListener('click', function (e) {
            e.preventDefault();
            var tag = this.parentNode;

            for (var i = 0; i < tagInput.wrapper.childNodes.length; i++) {
                if (tagInput.wrapper.childNodes[i] == tag)
                    tagInput.deleteTag(tag, i);
            }
        })


        tag.appendChild(closeIcon);
        this.wrapper.insertBefore(tag, this.input);
        this.orignal_input.value = this.arr.join(',');

        return this;
    }

    // Delete Tags
    TagsInput.prototype.deleteTag = function (tag, i) {
        tag.remove();
        this.arr.splice(i, 1);
        this.orignal_input.value = this.arr.join(',');
        return this;
    }

    // Make sure input string have no error with the plugin
    TagsInput.prototype.anyErrors = function (string) {
        if (this.options.max != null && this.arr.length >= this.options.max) {
            console.log('max tags limit reached');
            return true;
        }

        if (!this.options.duplicate && this.arr.indexOf(string) != -1) {
            console.log('duplicate found " ' + string + ' " ')
            return true;
        }

        return false;
    }

    // Add tags programmatically 
    TagsInput.prototype.addData = function (array) {
        var plugin = this;

        array.forEach(function (string) {
            plugin.addTag(string);
        })
        return this;
    }

    // Get the Input String
    TagsInput.prototype.getInputString = function () {
        return this.arr.join(',');
    }


    // destroy the plugin
    TagsInput.prototype.destroy = function () {
        this.orignal_input.removeAttribute('hidden');

        delete this.orignal_input;
        var self = this;

        Object.keys(this).forEach(function (key) {
            if (self[key] instanceof HTMLElement)
                self[key].remove();

            if (key != 'options')
                delete self[key];
        });

        this.initialized = false;
    }

    // Private function to initialize the tag input plugin
    function init(tags) {
        tags.wrapper.append(tags.input);
        tags.wrapper.classList.add(tags.options.wrapperClass);
        tags.orignal_input.setAttribute('hidden', 'true');
        tags.orignal_input.parentNode.insertBefore(tags.wrapper, tags.orignal_input);
    }

    // initialize the Events
    function initEvents(tags) {
        tags.wrapper.addEventListener('click', function () {
            tags.input.focus();
        });


        tags.input.addEventListener('keydown', function (e) {
            var str = tags.input.value.trim();

            if (!!(~[9, 13, 188].indexOf(e.keyCode))) {
                e.preventDefault();
                tags.input.value = "";
                if (str != "")
                    tags.addTag(str);
            }

        });
    }


    // Set All the Default Values
    TagsInput.defaults = {
        selector: '',
        wrapperClass: 'tags-input-wrapper',
        tagClass: 'tag',
        max: null,
        duplicate: false
    }

    window.TagsInput = TagsInput;

})();

var tagInput1 = new TagsInput({
    selector: 'tag-input1',
    duplicate: false,
    max: 10
});

async function elementUpdate(selector) {
    try {
        var html = await (await fetch(location.href)).text();
        var newdoc = new DOMParser().parseFromString(html, 'text/html');
        //document.querySelector(selector).outerHTML = newdoc.querySelector(selector).outerHTML;
        //console.log('Элемент ' + selector + ' был успешно обновлен');
        return true;
    } catch (err) {
        //console.log('При обновлении элемента ' + selector + ' произошла ошибка:');
        //console.dir(err);
        return false;
    }
}

(async function () {

    while (true) {

        await elementUpdate('div#block');
        await elementUpdate('div#like');
        await elementUpdate('div#comments');

        await new Promise(function (success) { setTimeout(success, 500); });

    }

})();

jQuery(document).ready(function ($) {
    $("#content").markdown({
        // Callback for the 'onShow' event.
        //   Here we will transform the custom button into a dropdown button.
        onShow: function (e) {
            // Get the custom button named "cmdBeer".
            var $button = e.$textarea
                .closest(".md-editor")
                .find('button[data-handler="bootstrap-markdown-cmdBeer"]');

            // Transform the button into a bootstrap dropdown menu button.
            // The list of options would be set as html code in the .after() method.
            $button
                .attr("data-toggle", "dropdown")
                .css({
                    float: "none"
                })
                .wrap('<div class="dropdown"></div>')
                .after(
                    '<ul class="dropdown-menu"><li><a data-cmd="item1">Item 1</a></li><li><a data-cmd="item2">Item 2</a></li></ul>'
                );

            // Add the click handler for the options. In this example we just write
            // the cmd into the content.
            $button
                .closest(".dropdown")
                .find(".dropdown-menu")
                .on("click", "a[data-cmd]", function () {
                    e.replaceSelection("CLICKED: " + $(this).data("cmd") + "\n");
                });

            // Inform bootstrap about the dropdown button.
            $button.dropdown();
        },
        additionalButtons: [
            [
                {
                    data: [
                        {
                            name: "cmdBeer",
                            title: "Beer",
                            icon: {
                                glyph: "glyphicon glyphicon-star",
                                fa: "fa fa-star",
                                "fa-3": "icon-star",
                                octicons: "octicon octicon-star"
                            }
                        }
                    ]
                }
            ]
        ]
    });
});

# This is the configuration file for Ghostty.

# Run `ghostty +show-config --default --docs` to view a list of

# all available config options and their default values.

#

# Config syntax crash course

# ==========================

# # The config file consists of simple key-value pairs,

# # separated by equals signs.

# font-family = Iosevka

# window-padding-x = 2

#

# # Spacing around the equals sign does not matter.

# # All of these are identical:

# key=value

# key= value

# key =value

# key = value

#

# # Any line beginning with a # is a comment. It's not possible to put

# # a comment after a config option, since it would be interpreted as a

# # part of the value. For example, this will have a value of "#123abc":

# background = #123abc

#

# # Empty values are used to reset config keys to default.

# key =

#

# # Some config options have unique syntaxes for their value,

# # which is explained in the docs for that config option.

# # Just for example:

# resize-overlay-duration = 4s 200ms

background-opacity = 0.7
background = #13171a
cursor-color = #00ffff
cursor-opacity = 0.9
cursor-style = block_hollow
cursor-style-blink = true
cursor-text = #ffeab3
mouse-hide-while-typing = true
mouse-scroll-multiplier = 2
font-style = Roboto Mono
background-blur = 20
unfocused-split-opacity = 0.5
unfocused-split-fill = #1c3e4a
working-directory = home
window-inherit-working-directory = true
window-title-font-family = FuturaT
window-subtitle = working-directory
window-height = 1080
window-width = 600
window-position-x = 0
window-position-y = 0
window-save-state = always
window-titlebar-background = #18141c
clipboard-write = allow
clipboard-read = allow
clipboard-paste-protection = false
image-storage-limit = 1000000000
quick-terminal-position = right
macos-titlebar-style = tabs
macos-titlebar-proxy-icon = hidden
macos-window-shadow = true
macos-icon-ghost-color = #00ffff
macos-icon-screen-color = #18141c
bold-is-bright = true
auto-update = download

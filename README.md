# jVideo Plugin #

## Plugin Information ##
Version: 1.0.0<br>
Developer: Carl Johnston<br>
Developer's Email: [carl@carljohnston.co.uk](mailto:carl@carljohnston.co.uk)<br>
Developer's Website: [http://carljohnston.co.uk](http://carljohnston.co.uk)<br>
Lisence: **TBC**

## Description ##
A javascript plugin to generate custom controls for banner ads.<br>
The plugin has been based on the styling and functionality of Google Web Designer's media player.

## Usage ##
### Invoking jVideo ###
To invoke the jVideo player, wrap your `<video>` tag with our custom `<j-video>` tag.

**Example**
```html
<j-video color="#123456" poster="img/poster.jpg" video-controls="autohide">

	<video id="video1">
		<source src="videos/video1.mp4" type="video/mp4">
		<source src="videos/video1.webm" type="video/webm">
		Your Browser does not support the HTML5 video tag.
	</video>

</j-video>
```

### Options ###
| Attribute        | Values                                                                  | Description |
| ---------------- | ----------------------------------------------------------------------- | ----------- |
| `poster`         | URL - `img/poster.jpg`                                                  | Image source for poster image |
| `color`          | Hex - `#ffffff`<br>RGB - `rgb(255, 255, 255)`<br>HSL - `hsl(0, 0%, 0%)` | Hex / RGB / HSL colour value |
| `video-controls` | `show`<br>`hide`<br>`autohide`                                          | Visible state of video controls |


`*` = Required attribute.

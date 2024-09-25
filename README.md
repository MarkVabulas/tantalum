![Tantalum Sample Render](https://raw.githubusercontent.com/tunabrain/tantalum/master/Header.jpg "Tantalum Redux Sample Render")

# The Tantalum Redux Renderer #

## This Fork ##

This fork takes the original Tantalum renderer and makes it into a passive viewing experience.  It retains the mouse-based interaction if desired, but generally just loops forever, generating a new ray pointing in a central-ish direction after each iteration completes.  I've created a new scene different from the previously provided ones, and used all of the materials available, including dialectrics, rough dialectrics, mirrors, and rough mirrors.

I would like to extend the my thanks to tunabrain for the original work, it was immaculate and clean.  I am planning on bundling this with my other project, [UltimateSensorMonitor](https://github.com/MarkVabulas/ultimon),  as an available background or disconnected screen.  It's for that purposes that interactivity was sacrificed for a dynamic and pleasing result.

## About ##

Tantalum is a physically based 2D renderer written out of personal interest. The idea of this project was to build a light transport simulation using the same mathematical tools used in academic and movie production renderers, but in a simplified 2D setting. The 2D setting allows for faster render times and a more accessible way of understanding and interacting with light, even for people with no prior knowledge or interest in rendering.

Tantalum is written in JavaScript and WebGL.

## License ##

To give developers as much freedom as is reasonable, Tantalum is distributed under the [libpng/zlib](http://opensource.org/licenses/Zlib) license. This allows you to modify, redistribute and sell all or parts of the code without attribution.

Note that Tantalum includes several third-party libraries in the `src/thirdparty` folder that come with their own licenses. Please see the `LICENSE.txt` file for more information.

## Compilation ##

The only thing that needs to be compiled are the shaders, contained in the `shaders` subfolder. The `compile_shaders.py` script will turn those text files into a list of strings in a JS file (needs Python 3).

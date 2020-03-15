# A game to draw cycloid and curves like cycloid

This game draw the tracks of a the two end points of a segment with length 1.
The segment rotates evenly. And you can control the velocity of the segment center.

We use Fourier series to represent the velocity of the segment center as shown below.
$ v_x = v_{x0} + v_{x1} * cos(\omega t) + v_{x2} * sin(\omega t)$
$ v_y = v_{y0} + v_{y1} * cos(\omega t) + v_{y2} * sin(\omega t)$

In which, $ \omega $ is the rotation velocity of the segment
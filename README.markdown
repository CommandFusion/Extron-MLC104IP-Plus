# iViewer interface for Extron MLC104IP Plus

Sample demo GUI for controlling the Extron device via TCP, Port 23.

### Setup & Resources
1. Extron's Global Configurator software to program and assign functions to the MLC unit. In this sample GUI, the unit was pre-programmed with Projector On/Off, Volume Control and 4 Input selections.
1. SIS Command Table (starting from chapter 4) from the [user manual](http://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=0CC4QFjAB&url=http%3A%2F%2Fmedia.extron.com%2Fdownload%2Ffiles%2Fuserman%2F68-1443-01B_MLC104PlusSer_011309.pdf&ei=-iErU9uJMciArgfHjIHwCA&usg=AFQjCNGO1Akfg9QO8mDByD2e4bx9v18WlA&bvm=bv.63316862,d.bmk&cad=rja).

### Special Note
1. Will need to periodically send some query to the unit as the IP connection will be closed after a specified timeout.
1. To get properly formatted feedback string, need to choose and set the appropriate verbose/response mode status on startup.
1. Feedback from hard-button presses on the Extron unit will only be available when the verbose mode is on.

### Bug Reporting/Feature Requests

Please help to post any bug/issues to the [issues](https://github.com/CommandFusion/Extron-MLC104IP-Plus/issues) tab of this GitHub repo for easier tracking and reference.
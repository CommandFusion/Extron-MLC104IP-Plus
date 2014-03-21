/*	Extron MLC 104IP Plus Sample GUI
===============================================================================

AUTHOR:		Terence, CommandFusion.
CONTACT:	terence@commandfusion.com
Original Module URL:		
VERSION:	v0.01
LAST MOD:	
MODULE JOIN RANGE: 
MODULE TEST SETUP: Extron MLC 104IP Plus
===============================================================================
Todo list:

Check :

Special Note:

*/

	
//----------------------------------------------------------------------------------------------------------------
//Initialization of instance
//----------------------------------------------------------------------------------------------------------------
//var extron = function(systemName, feedbackName) {};

var timer;
var displayPowDownTimer = 90000; 	// 90s = 90000 ms
var displayPowUpTimer = 30000; 		// 30s = 30000 ms

//For standalone system
var extron = {
	
	// ======================================================================
	// Constants
	// - Change the value here to be used for the rest of the program.
	// ======================================================================
	
	//System 1 Settings
	system1: "MLC",		// MLC #1
	
	// ======================================================================
	// Setup 
	// ======================================================================
	
	setup: function() {
		
		// Watch all incoming connection status feedback item : Syntax CF.watch(CF.event, systemName, feedbackName, feedbackFunction)
		CF.watch(CF.FeedbackMatchedEvent, extron.system1, "AllFB", extron.incomingData); 
		
	},
	
	// ======================================================================
	//  Other functions
	// ======================================================================
	
	// =============================================================================================================================
	// Regex for all feedbacks coming through a single feedback item. For parsing various incoming data :
	// 
	//  /g enables "global" matching. When using the replace() method, specify this modifier to replace all matches, rather than only the first one.
    //	/i makes the regex match case insensitive.
    //	/m enables "multi-line mode". In this mode, the caret and dollar match before and after newlines in the subject string. 
	// =============================================================================================================================
	
	connStatusRegex: /^Pcs(\d)/,										// Pcs0\x0D\x0A
	displayPowerRegex: /^Pwr(\d)/,										// Pwr2\x0D\x0A
	lampHourRegex: /^Lhr\*(\d{5})/,										// Lhr*00000\x0D\x0A
	audioMuteRegex: /^Amt(\d)/,											// Amt0\x0D\x0A
	displayMuteRegex: /^Mut(\d)/,										// Mut0\x0D\x0A
	
	// =============================================================================================================================
	// Incoming Data Point - Only used to populate array with data. Populations of lists will be done by other functions.
	// =============================================================================================================================	
	
	incomingData: function (itemName, matchedString) {
		
		if (extron.displayPowerRegex.test(matchedString)) {							// Test for Display Power feedback
				var matches = extron.displayPowerRegex.exec(matchedString);			
				
				switch(parseInt(matches[1]))
				{	
					case 0: 											// display power off
						CF.setJoin("d111", 1);
						CF.setJoin("d110", 0);
						extron.stopBlink();
						CF.setJoin("d20", 0);
						CF.setJoin("d21", 0);
						break;
					case 1: 											// display power on 
						CF.setJoin("d111", 0);
						CF.setJoin("d110", 1);
						extron.stopBlink();
						CF.setJoin("d20", 0);
						CF.setJoin("d21", 0);
						break;		
					case 2: 											// display powering off (shutting down) 90s
						CF.setJoin("d111", 0);
						CF.setJoin("d110", 0);
						extron.startBlink(111);
						setTimeout(function(){extron.stopBlink();}, displayPowDownTimer);
						CF.setJoin("d20", 0);
						CF.setJoin("d21", 1);
						break;
					case 3: 											// display powering on (warming up) 30s
						CF.setJoin("d111", 0);
						CF.setJoin("d110", 0);
						extron.startBlink(110);
						setTimeout(function(){extron.stopBlink();}, displayPowUpTimer);
						CF.setJoin("d20", 1);
						CF.setJoin("d21", 0);
						break;		
				}	
				extron.displayPowerRegex.lastIndex = 0;
		
		} else if (extron.connStatusRegex.test(matchedString)) {							// Test for Connection Status feedback		
				var matches = extron.connStatusRegex.exec(matchedString);			
				
				switch(parseInt(matches[1]))
				{	
					case 0: CF.setJoin("s101", "Disconnected"); break;
					case 1: CF.setJoin("s101", "Connected"); break;
					case 2: CF.setJoin("s101", "Unknown"); break;	
				}	
				extron.connStatusRegex.lastIndex = 0;
		
		} else if (extron.lampHourRegex.test(matchedString)) {							// Test for Lamp hour feedback
				var matches = extron.lampHourRegex.exec(matchedString);			
					var lampHour = parseInt(matches[1]);
					CF.setJoin("s102", lampHour); 
				extron.lampHourRegex.lastIndex = 0;
		}  
	}, 
	
	// =============================================================================================================================
	// Other functions here
	// =============================================================================================================================	
	
	startBlink: function(join){
		clearInterval(timer);
		timer = setInterval( function() {
			CF.setJoin("d"+join, 0);
			setTimeout(function(){CF.setJoin("d"+join, 1);}, 500);
		}, 1000);
	},
	
	stopBlink: function(){	clearInterval(timer);	},
	
	/* not used at the moment. Project using commands.
	
	// =============================================================================================================================
	// All Commands here. To control different system, just input the relevant system name in the function.
	// Format the command string to send to system : CF.send(systemName, string [, oextronutFormat])
	// =============================================================================================================================
	
	// Input Selection
	input1: function(system) { CF.send(system, "1!"); },
	input2: function(system) { CF.send(system, "2!"); },
	input3: function(system) { CF.send(system, "3!"); },
	input4: function(system) { CF.send(system, "4!"); },
	
	// Display (Projector) Power
	displayOn: 				function(system) { CF.send(system, "1P"); },
	displayOff: 			function(system) { CF.send(system, "0P"); },
	displayShowStatus:		function(system) { CF.send(system, "P"); },
	displaySetStatusOff: 	function(system) { CF.send(system, "0*0P"); },
	displaySetStatusOn: 	function(system) { CF.send(system, "1*0P"); },
	displaySetPowerDown: 	function(system) { CF.send(system, "3*0P"); },
	displaySetPowerUp: 		function(system) { CF.send(system, "4*0P"); },
	displayMuteOn: 			function(system) { CF.send(system, "1M"); },
	displayMuteOff: 		function(system) { CF.send(system, "0M"); },
	displayShowMute:		function(system) { CF.send(system, "M"); },
	displaySetMuteOn: 		function(system) { CF.send(system, "1*0M"); },
	displaySetMuteOff: 		function(system) { CF.send(system, "0*0M"); },
	displaySetMuteUnknown: 	function(system) { CF.send(system, "3*0M"); },
	
	// Volume
	volSet: 		function(system, level) { CF.send(system, level+"V"); },
	volUp: 			function(system) { CF.send(system, "+V"); },
	volDown: 		function(system) { CF.send(system, "-V"); },
	volStatus: 		function(system) { CF.send(system, "V"); },
	volMuteOn: 		function(system) { CF.send(system, "1Z"); },
	volMuteOff: 	function(system) { CF.send(system, "0Z"); },
	volMuteStatus: 	function(system) { CF.send(system, "Z"); },
	
	// Status commands
	viewLampHours:			function(system) { CF.send(system, "6S"); },
	viewConnectionStatus:	function(system) { CF.send(system, "7S"); },
	
	*/
	
	// Only allow logging calls when CF is in debug mode - better performance in release mode this way
	log: function(msg) {
			if (CF.debug) {
				CF.log(msg);
			}
		}
};

CF.modules.push(
	{
		name:"Extron MLC104IP Plus", 	// the name of the module (mostly for display purposes)
		setup: extron.setup,				// the setup function to call
		object: extron,       				// the object to which the setup function belongs
		version: "Beta v0.01"       	// An optional module version number that is displayed in the Remote Debugger
	}
);

/* Sample feedback :

Button Press - Chn01
Evt00002,2,0000000092,129

Button Press - Chn02
Evt00002,2,0000000092,129

Button Press - Chn03
Evt00002,2,0000000092,129

Button Press - Chn04
Evt00002,2,00000000100,1444


OK
Evt00002,2,0000000076,3 - Pwr0
Evt00002,2,0000000076,1 - Pwr1
Pwr2
Pwr3

OK
Vol000
Vol100

*/

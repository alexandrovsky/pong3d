/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var FizzyText = function() {
            this.message = 'dat.gui';
            this.speed = 0.8;
            this.displayOutline = false;            
          };

          window.onload = function() {
            var text = new FizzyText();
            var gui = new dat.GUI();
            gui.add(text, 'message');
            gui.add(text, 'speed', -5, 5);
            gui.add(text, 'displayOutline');            
          };
module.exports = function (trackId) {
    return `var _wa= _wa || [ ];
_wa.push(['track', '${trackId}']);
(function() {
var newScript = document.createElement('script');
newScript.async = true;
newScript.src = 'http://localhost:4000/resources/javascripts/wa.js';
var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore(newScript, firstScript);
})();`;
};

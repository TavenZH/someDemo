/**
 * 调用native方法
 */
var NativeBridge = (function(window) {
	var m = {};
	console.log(" navigator.userAgent " + navigator.userAgent);
	console.log(" navigator.vendor)" + navigator.vendor);
	m.isChromeWebView = /android/.test(navigator.userAgent);
	m.isUiWebView = /iPhone/.test(navigator.userAgent);
	/**
	 * 调用native
	 */
	m.callNative = function(method, param, callback) {
		if (!method) {
			return;
		}
		callback = callback ? callback : function() {
		};
		if (this.isChromeWebView) {
			var result;
			if (param) {
				result = window.JsToJava[method](param);
			} else {
				result = window.JsToJava[method]();
			}
			callback(result);
		}
		if (this.isUiWebView) {
			param = param ? param : {};
			callback = callback ? callback : {};
			JsToObjectiveC.callHandler(method, param, callback);
		}
		if (!this.isChromeWebView && !this.isUiWebView) {
			callback("");
		}
	}
	return m;
})(window);
(function() {
	// Private array of chars to use
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
			.split('');

	Math.uuid = function(len, radix) {
		var chars = CHARS, uuid = [], i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++)
				uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data. At i==19 set the high bits of clock sequence
			// as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	}
})();
$.fn.setDisabled = function() {
	if ($(this).is('select')) {
		var mtext = $(this).find('option:selected').text();
		var mvalue = $(this).val();
		var mid = $(this).attr("id");

		$(this).parent().append("<input type=\"hidden\" value=\"" + mvalue
				+ "\" name=\"" + mid + "\" id=\"" + mid + "\">");
		$(this).parent().append("<input type=\"text\" value=\"" + mtext
				+ "\"  readonly=\"readonly\" class=\"form-control\">");
		$(this).remove();
	} else {
		$(this).attr("readonly", "readonly");
		$(this).attr('disabled', 'disabled');
	}
}

$.fn.serializeObject = function() {
	var o = {};
	// var a = this.serializeArray();
	$(this)
			.find('input[type="hidden"], input[type="text"], input[type="number"], input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select,textarea')
			.each(function() {
				if ($(this).attr('type') == 'hidden') { // if checkbox
					// is
					// checked do not take
					// the hidden field
					var $parent = $(this).parent();
					var $chb = $parent.find('input[type="checkbox"][name="'
							+ this.name.replace(/\[/g, '\[').replace(/\]/g,
									'\]') + '"]');
					if ($chb != null) {
						if ($chb.prop('checked'))
							return;
					}
				}
				if (this.name === null || this.name === undefined
						|| this.name === '')
					return;
				var elemValue = null;
				if ($(this).is('select')) {
					elemValue = $(this).find('option:selected').val();
				} else if ($(this).is('textarea')) {
					elemValue = $(this).val();
				} else
					elemValue = this.value;

				if (o[this.name] !== undefined) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(elemValue || '');
				} else {
					o[this.name] = elemValue || '';
				}
			});
	return o;
}

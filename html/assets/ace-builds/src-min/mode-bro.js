define('ace/mode/bro_highlight_rules', [
	'require',
	'exports',
	'module',
	'ace/lib/oop',
	'ace/mode/text_highlight_rules'
], function(e, t, n) {
	'use strict';
	var r = e('../lib/oop'),
		i = e('./text_highlight_rules').TextHighlightRules,
		s = function() {
			(this.$rules = {
				start: [
					{
						token: 'punctuation.definition.comment.bro',
						regex: /#/,
						push: [
							{
								token: 'comment.line.number-sign.bro',
								regex: /$/,
								next: 'pop'
							},
							{ defaultToken: 'comment.line.number-sign.bro' }
						]
					},
					{
						token: 'keyword.control.bro',
						regex: /\b(?:break|case|continue|else|for|if|return|switch|next|when|timeout|schedule)\b/
					},
					{
						token: [
							'meta.function.bro',
							'meta.function.bro',
							'storage.type.bro',
							'meta.function.bro',
							'entity.name.function.bro',
							'meta.function.bro'
						],
						regex: /^(\s*)(?:function|hook|event)(\s*)(.*)(\s*\()(.*)(\).*$)/
					},
					{
						token: 'storage.type.bro',
						regex: /\b(?:bool|enum|double|int|count|port|addr|subnet|any|file|interval|time|string|table|vector|set|record|pattern|hook)\b/
					},
					{
						token: 'storage.modifier.bro',
						regex: /\b(?:global|const|redef|local|&(?:optional|rotate_interval|rotate_size|add_func|del_func|expire_func|expire_create|expire_read|expire_write|persistent|synchronized|encrypt|mergeable|priority|group|type_column|log|error_handler))\b/
					},
					{
						token: 'keyword.operator.bro',
						regex: /\s*(?:\||&&|(?:>|<|!)=?|==)\s*|\b!?in\b/
					},
					{ token: 'constant.language.bro', regex: /\b(?:T|F)\b/ },
					{
						token: 'constant.numeric.bro',
						regex: /\b(?:0(?:x|X)[0-9a-fA-F]*|(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:(?:e|E)(?:\+|-)?[0-9]+)?)(?:\/(?:tcp|udp|icmp)|\s*(?:u?sec|min|hr|day)s?)?\b/
					},
					{
						token: 'punctuation.definition.string.begin.bro',
						regex: /"/,
						push: [
							{
								token: 'punctuation.definition.string.end.bro',
								regex: /"/,
								next: 'pop'
							},
							{ include: '#string_escaped_char' },
							{ include: '#string_placeholder' },
							{ defaultToken: 'string.quoted.double.bro' }
						]
					},
					{
						token: 'punctuation.definition.string.begin.bro',
						regex: /\//,
						push: [
							{
								token: 'punctuation.definition.string.end.bro',
								regex: /\//,
								next: 'pop'
							},
							{ include: '#string_escaped_char' },
							{ include: '#string_placeholder' },
							{ defaultToken: 'string.quoted.regex.bro' }
						]
					},
					{
						token: [
							'meta.preprocessor.bro.load',
							'keyword.other.special-method.bro'
						],
						regex: /^(\s*)(\@load(?:-sigs)?)\b/,
						push: [
							{ token: [], regex: /(?=\#)|$/, next: 'pop' },
							{ defaultToken: 'meta.preprocessor.bro.load' }
						]
					},
					{
						token: [
							'meta.preprocessor.bro.if',
							'keyword.other.special-method.bro',
							'meta.preprocessor.bro.if'
						],
						regex: /^(\s*)(\@endif|\@if(?:n?def)?)(.*$)/,
						push: [
							{ token: [], regex: /$/, next: 'pop' },
							{ defaultToken: 'meta.preprocessor.bro.if' }
						]
					}
				],
				'#disabled': [
					{
						token: 'text',
						regex: /^\s*\@if(?:n?def)?\b.*$/,
						push: [
							{
								token: 'text',
								regex: /^\s*\@endif\b.*$/,
								next: 'pop'
							},
							{ include: '#disabled' },
							{ include: '#pragma-mark' }
						],
						comment: 'eat nested preprocessor ifdefs'
					}
				],
				'#preprocessor-rule-other': [
					{
						token: [
							'text',
							'meta.preprocessor.bro',
							'meta.preprocessor.bro',
							'text'
						],
						regex: /^(\s*)(@if)((?:n?def)?)\b(.*?)(?:(?=)|$)/,
						push: [
							{
								token: [
									'text',
									'meta.preprocessor.bro',
									'text'
								],
								regex: /^(\s*)(@endif)\b(.*$)/,
								next: 'pop'
							},
							{ include: '$base' }
						]
					}
				],
				'#string_escaped_char': [
					{
						token: 'constant.character.escape.bro',
						regex: /\\(?:\\|[abefnprtv'"?]|[0-3]\d{,2}|[4-7]\d?|x[a-fA-F0-9]{,2})/
					},
					{
						token: 'invalid.illegal.unknown-escape.bro',
						regex: /\\./
					}
				],
				'#string_placeholder': [
					{
						token: 'constant.other.placeholder.bro',
						regex: /%(?:\d+\$)?[#0\- +']*[,;:_]?(?:-?\d+|\*(?:-?\d+\$)?)?(?:\.(?:-?\d+|\*(?:-?\d+\$)?)?)?(?:hh|h|ll|l|j|t|z|q|L|vh|vl|v|hv|hl)?[diouxXDOUeEfFgGaACcSspn%]/
					},
					{ token: 'invalid.illegal.placeholder.bro', regex: /%/ }
				]
			}),
				this.normalizeRules();
		};
	(s.metaData = {
		fileTypes: ['bro'],
		foldingStartMarker: '^(\\@if(n?def)?)',
		foldingStopMarker: '^\\@endif',
		keyEquivalent: '@B',
		name: 'Bro',
		scopeName: 'source.bro'
	}),
		r.inherits(s, i),
		(t.BroHighlightRules = s);
}),
	define('ace/mode/folding/cstyle', [
		'require',
		'exports',
		'module',
		'ace/lib/oop',
		'ace/range',
		'ace/mode/folding/fold_mode'
	], function(e, t, n) {
		'use strict';
		var r = e('../../lib/oop'),
			i = e('../../range').Range,
			s = e('./fold_mode').FoldMode,
			o = (t.FoldMode = function(e) {
				e &&
					((this.foldingStartMarker = new RegExp(
						this.foldingStartMarker.source.replace(
							/\|[^|]*?$/,
							'|' + e.start
						)
					)),
					(this.foldingStopMarker = new RegExp(
						this.foldingStopMarker.source.replace(
							/\|[^|]*?$/,
							'|' + e.end
						)
					)));
			});
		r.inherits(o, s),
			function() {
				(this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
					(this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
					(this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
					(this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
					(this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
					(this._getFoldWidgetBase = this.getFoldWidget),
					(this.getFoldWidget = function(e, t, n) {
						var r = e.getLine(n);
						if (
							this.singleLineBlockCommentRe.test(r) &&
							!this.startRegionRe.test(r) &&
							!this.tripleStarBlockCommentRe.test(r)
						)
							return '';
						var i = this._getFoldWidgetBase(e, t, n);
						return !i && this.startRegionRe.test(r) ? 'start' : i;
					}),
					(this.getFoldWidgetRange = function(e, t, n, r) {
						var i = e.getLine(n);
						if (this.startRegionRe.test(i))
							return this.getCommentRegionBlock(e, i, n);
						var s = i.match(this.foldingStartMarker);
						if (s) {
							var o = s.index;
							if (s[1])
								return this.openingBracketBlock(e, s[1], n, o);
							var u = e.getCommentFoldRange(
								n,
								o + s[0].length,
								1
							);
							return (
								u &&
									!u.isMultiLine() &&
									(r
										? (u = this.getSectionRange(e, n))
										: t != 'all' && (u = null)),
								u
							);
						}
						if (t === 'markbegin') return;
						var s = i.match(this.foldingStopMarker);
						if (s) {
							var o = s.index + s[0].length;
							return s[1]
								? this.closingBracketBlock(e, s[1], n, o)
								: e.getCommentFoldRange(n, o, -1);
						}
					}),
					(this.getSectionRange = function(e, t) {
						var n = e.getLine(t),
							r = n.search(/\S/),
							s = t,
							o = n.length;
						t += 1;
						var u = t,
							a = e.getLength();
						while (++t < a) {
							n = e.getLine(t);
							var f = n.search(/\S/);
							if (f === -1) continue;
							if (r > f) break;
							var l = this.getFoldWidgetRange(e, 'all', t);
							if (l) {
								if (l.start.row <= s) break;
								if (l.isMultiLine()) t = l.end.row;
								else if (r == f) break;
							}
							u = t;
						}
						return new i(s, o, u, e.getLine(u).length);
					}),
					(this.getCommentRegionBlock = function(e, t, n) {
						var r = t.search(/\s*$/),
							s = e.getLength(),
							o = n,
							u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
							a = 1;
						while (++n < s) {
							t = e.getLine(n);
							var f = u.exec(t);
							if (!f) continue;
							f[1] ? a-- : a++;
							if (!a) break;
						}
						var l = n;
						if (l > o) return new i(o, r, l, t.length);
					});
			}.call(o.prototype);
	}),
	define('ace/mode/bro', [
		'require',
		'exports',
		'module',
		'ace/lib/oop',
		'ace/mode/text',
		'ace/mode/bro_highlight_rules',
		'ace/mode/folding/cstyle'
	], function(e, t, n) {
		'use strict';
		var r = e('../lib/oop'),
			i = e('./text').Mode,
			s = e('./bro_highlight_rules').BroHighlightRules,
			o = e('./folding/cstyle').FoldMode,
			u = function() {
				(this.HighlightRules = s), (this.foldingRules = new o());
			};
		r.inherits(u, i),
			function() {
				this.$id = 'ace/mode/bro';
			}.call(u.prototype),
			(t.Mode = u);
	});

define('ace/mode/matching_brace_outdent', [
	'require',
	'exports',
	'module',
	'ace/range'
], function(require, exports, module) {
	'use strict';

	var Range = require('../range').Range;

	var MatchingBraceOutdent = function() {};

	(function() {
		this.checkOutdent = function(line, input) {
			if (!/^\s+$/.test(line)) return false;

			return /^\s*\}/.test(input);
		};

		this.autoOutdent = function(doc, row) {
			var line = doc.getLine(row);
			var match = line.match(/^(\s*\})/);

			if (!match) return 0;

			var column = match[1].length;
			var openBracePos = doc.findMatchingBracket({
				row: row,
				column: column
			});

			if (!openBracePos || openBracePos.row == row) return 0;

			var indent = this.$getIndent(doc.getLine(openBracePos.row));
			doc.replace(new Range(row, 0, row, column - 1), indent);
		};

		this.$getIndent = function(line) {
			return line.match(/^\s*/)[0];
		};
	}.call(MatchingBraceOutdent.prototype));

	exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define('ace/mode/doc_comment_highlight_rules', [
	'require',
	'exports',
	'module',
	'ace/lib/oop',
	'ace/mode/text_highlight_rules'
], function(require, exports, module) {
	'use strict';

	var oop = require('../lib/oop');
	var TextHighlightRules = require('./text_highlight_rules')
		.TextHighlightRules;

	var DocCommentHighlightRules = function() {
		this.$rules = {
			start: [
				{
					token: 'comment.doc.tag',
					regex: '@[\\w\\d_]+' // TODO: fix email addresses
				},
				DocCommentHighlightRules.getTagRule(),
				{
					defaultToken: 'comment.doc',
					caseInsensitive: true
				}
			]
		};
	};

	oop.inherits(DocCommentHighlightRules, TextHighlightRules);

	DocCommentHighlightRules.getTagRule = function(start) {
		return {
			token: 'comment.doc.tag.storage.type',
			regex: '\\b(?:TODO|FIXME|XXX|HACK)\\b'
		};
	};

	DocCommentHighlightRules.getStartRule = function(start) {
		return {
			token: 'comment.doc', // doc comment
			regex: '\\/\\*(?=\\*)',
			next: start
		};
	};

	DocCommentHighlightRules.getEndRule = function(start) {
		return {
			token: 'comment.doc', // closing comment
			regex: '\\*\\/',
			next: start
		};
	};

	exports.DocCommentHighlightRules = DocCommentHighlightRules;
});
// Created with https://ace.c9.io/tool/mode_creator.html
define('ace/mode/hpf_highlight_rules', [
	'require',
	'exports',
	'module',
	'ace/lib/oop',
	'ace/lib/lang',
	'ace/mode/javascript_highlight_rules'
], function(require, exports, module) {
	/* global define */
	'use strict';

	var oop = require('../lib/oop');
	var JavaScriptHighlightRules = require('./javascript_highlight_rules')
		.JavaScriptHighlightRules;

	function pop(currentState, stack) {
		stack.splice(0, 2);
		return stack.shift() || 'start';
	}
	function pop2(currentState, stack) {
		stack.splice(0, 3);
		return stack.shift() || 'start';
	}
	var HpfHighlightRules = function() {
		JavaScriptHighlightRules.call(this);
		var hpf = {
			regex: '(?=<<)',
			push: 'hapify'
		};
		var blank = {
			token: 'hpf.blank',
			regex: /^( *)$/
		};
		for (var key in this.$rules) {
			this.$rules[key].unshift(blank, hpf);
		}
		this.$rules.hapify = [
			{
				token: 'hpf.eval.start',
				regex: /\<\<\<([\s\S]+?)/,
				push: [
					{
						token: 'hpf.eval.end',
						regex: '>>>',
						next: pop2
					},
					{
						defaultToken: 'hpf.eval'
					}
				]
			},
			{
				token: 'hpf.cmt.start',
				regex: /\<\<\#([\s\S]+?)/,
				push: [
					{
						token: 'hpf.cmt.end',
						regex: '>>',
						next: pop2
					},
					{
						defaultToken: 'hpf.cmt'
					}
				]
			},
			{
				token: 'hpf.cond.start',
				regex: /\<\<\?(\?)?\s*([\s\S]*?)\s*/,
				push: [
					{
						token: 'hpf.cond.end',
						regex: '>>',
						next: pop2
					},
					{
						defaultToken: 'hpf.cond'
					}
				]
			},
			{
				token: 'hpf.iter.start',
				regex: /\<\<\@\s*([\s\S]*?)\s*/,
				push: [
					{
						token: 'hpf.iter.end',
						regex: '>>',
						next: pop2
					},
					{
						defaultToken: 'hpf.iter'
					}
				]
			},
			{
				token: 'hpf.inter.start',
				regex: /\<\<\=([\s\S]*?)\s*/,
				push: [
					{
						token: 'hpf.inter.end',
						regex: '>>',
						next: pop2
					},
					{
						defaultToken: 'hpf.inter'
					}
				]
			},
			{
				token: 'hpf.inter.start.name',
				regex: /\<\<[^\<]([\s\S]*?)\s*/,
				push: [
					{
						token: 'hpf.inter.end.name',
						regex: '>>',
						next: pop2
					},
					{
						defaultToken: 'hpf.inter.name'
					}
				]
			}
		];

		this.normalizeRules();
	};

	oop.inherits(HpfHighlightRules, JavaScriptHighlightRules);

	exports.HpfHighlightRules = HpfHighlightRules;
});

define('ace/mode/folding/cstyle', [
	'require',
	'exports',
	'module',
	'ace/lib/oop',
	'ace/range',
	'ace/mode/folding/fold_mode'
], function(require, exports, module) {
	'use strict';

	var oop = require('../../lib/oop');
	var Range = require('../../range').Range;
	var BaseFoldMode = require('./fold_mode').FoldMode;

	var FoldMode = (exports.FoldMode = function(commentRegex) {
		if (commentRegex) {
			this.foldingStartMarker = new RegExp(
				this.foldingStartMarker.source.replace(
					/\|[^|]*?$/,
					'|' + commentRegex.start
				)
			);
			this.foldingStopMarker = new RegExp(
				this.foldingStopMarker.source.replace(
					/\|[^|]*?$/,
					'|' + commentRegex.end
				)
			);
		}
	});
	oop.inherits(FoldMode, BaseFoldMode);

	(function() {
		this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
		this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
		this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
		this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
		this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
		this._getFoldWidgetBase = this.getFoldWidget;
		this.getFoldWidget = function(session, foldStyle, row) {
			var line = session.getLine(row);

			if (this.singleLineBlockCommentRe.test(line)) {
				if (
					!this.startRegionRe.test(line) &&
					!this.tripleStarBlockCommentRe.test(line)
				)
					return '';
			}

			var fw = this._getFoldWidgetBase(session, foldStyle, row);

			if (!fw && this.startRegionRe.test(line)) return 'start'; // lineCommentRegionStart

			return fw;
		};

		this.getFoldWidgetRange = function(
			session,
			foldStyle,
			row,
			forceMultiline
		) {
			var line = session.getLine(row);

			if (this.startRegionRe.test(line))
				return this.getCommentRegionBlock(session, line, row);

			var match = line.match(this.foldingStartMarker);
			if (match) {
				var i = match.index;

				if (match[1])
					return this.openingBracketBlock(session, match[1], row, i);

				var range = session.getCommentFoldRange(
					row,
					i + match[0].length,
					1
				);

				if (range && !range.isMultiLine()) {
					if (forceMultiline) {
						range = this.getSectionRange(session, row);
					} else if (foldStyle != 'all') range = null;
				}

				return range;
			}

			if (foldStyle === 'markbegin') return;

			var match = line.match(this.foldingStopMarker);
			if (match) {
				var i = match.index + match[0].length;

				if (match[1])
					return this.closingBracketBlock(session, match[1], row, i);

				return session.getCommentFoldRange(row, i, -1);
			}
		};

		this.getSectionRange = function(session, row) {
			var line = session.getLine(row);
			var startIndent = line.search(/\S/);
			var startRow = row;
			var startColumn = line.length;
			row = row + 1;
			var endRow = row;
			var maxRow = session.getLength();
			while (++row < maxRow) {
				line = session.getLine(row);
				var indent = line.search(/\S/);
				if (indent === -1) continue;
				if (startIndent > indent) break;
				var subRange = this.getFoldWidgetRange(session, 'all', row);

				if (subRange) {
					if (subRange.start.row <= startRow) {
						break;
					} else if (subRange.isMultiLine()) {
						row = subRange.end.row;
					} else if (startIndent == indent) {
						break;
					}
				}
				endRow = row;
			}

			return new Range(
				startRow,
				startColumn,
				endRow,
				session.getLine(endRow).length
			);
		};
		this.getCommentRegionBlock = function(session, line, row) {
			var startColumn = line.search(/\s*$/);
			var maxRow = session.getLength();
			var startRow = row;

			var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
			var depth = 1;
			while (++row < maxRow) {
				line = session.getLine(row);
				var m = re.exec(line);
				if (!m) continue;
				if (m[1]) depth--;
				else depth++;

				if (!depth) break;
			}

			var endRow = row;
			if (endRow > startRow) {
				return new Range(startRow, startColumn, endRow, line.length);
			}
		};
	}.call(FoldMode.prototype));
});

define('ace/mode/hpf', [
	'require',
	'exports',
	'module',
	'ace/lib/oop',
	'ace/mode/text',
	'ace/mode/matching_brace_outdent',
	'ace/mode/hpf_highlight_rules',
	'ace/mode/folding/cstyle'
], function(require, exports, module) {
	'use strict';

	var oop = require('../lib/oop');
	var TextMode = require('./text').Mode;
	var MatchingBraceOutdent = require('./matching_brace_outdent')
		.MatchingBraceOutdent;
	var HpfHighlightRules = require('./hpf_highlight_rules').HpfHighlightRules;
	var HpfFoldMode = require('./folding/cstyle').FoldMode;

	var Mode = function() {
		this.HighlightRules = HpfHighlightRules;
		this.$outdent = new MatchingBraceOutdent();
		this.foldingRules = new HpfFoldMode();
		this.$behaviour = this.$defaultBehaviour;
	};
	oop.inherits(Mode, TextMode);

	(function() {
		this.lineCommentStart = ['//', '#'];
		this.blockComment = { start: '/*', end: '*/' };

		this.getNextLineIndent = function(state, line, tab) {
			var indent = this.$getIndent(line);

			var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
			var tokens = tokenizedLine.tokens;
			var endState = tokenizedLine.state;

			if (tokens.length && tokens[tokens.length - 1].type == 'comment') {
				return indent;
			}

			if (state == 'start') {
				var match = line.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);
				if (match) {
					indent += tab;
				}
			}

			return indent;
		};

		this.checkOutdent = function(state, line, input) {
			return this.$outdent.checkOutdent(line, input);
		};

		this.autoOutdent = function(state, doc, row) {
			this.$outdent.autoOutdent(doc, row);
		};

		this.$id = 'ace/mode/hpf';
	}.call(Mode.prototype));

	exports.Mode = Mode;
});

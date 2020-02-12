const mjpage = require('mathjax-node-page').mjpage;
const sre = require('speech-rule-engine');

module.exports = {
    processRequest: async(req, res) => {
        try {
            if (!req.body) {
                res.status(400).send({
                    success: 0,
                    content: 'request has no body'
                });
                return;
            }

            if (!req.body.latex) {
                res.status(400).send({
                    success: 0,
                    content: 'request has no latex attribute and/or value in body'
                });
                return;
            }

            req.body.latex = req.body.latex.replace("\\(", "$").replace("\\)", "$").replace("\\[", "$").replace("\\]", "$");

            mjpage(req.body.latex, {
                format: ["TeX"],
                fragment: true,
                cssInline: false,
                linebreaks: true,
                singleDollars: true,
                speakText: false,
            }, {
                mml: true,
                svg: true
            }, (output) => {
                res.status(201).send(
                    output
                );
                return;
            }).on('afterConversion', function(parsedFormula) {

                sre.setupEngine({locale: 'en'});

                parsedFormula.node.innerHTML = '<span style="font-size: 0px;"> ' +
                    sre.toSpeech(parsedFormula.outputFormula.mml) +
                    '</span>' + parsedFormula.outputFormula.svg;

                var title = parsedFormula.node.getElementsByTagName("title")[0];
                if (title) {
                    title.parentNode.removeChild(title);
                }

                var label = parsedFormula.node.getElementsByTagName("svg")[0];
                if (label) {
                    label.removeAttribute('aria-labelledby');
                    label.setAttribute('aria-label', 'Latex Formula');
                }
            });
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: 0,
                content: 'an error occured in processRequest()'
            });
            return;
        }
    }
}
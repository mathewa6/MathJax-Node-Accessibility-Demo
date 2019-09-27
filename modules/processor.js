const mjpage = require('mathjax-node-page').mjpage;

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

            mjpage(req.body.latex, {
                format: ["TeX"],
                fragment: true,
                cssInline: true,
                linebreaks: true,
                singleDollars: true,
                svg: true
            }, {
                mml: true,
                svg: true
            }, (output) => {
                res.status(201).send(
                    output
                );
                return;
            }, (error) => {
                console.log(error)
                res.status(500).send({
                    success: 0,
                    content: 'an error occured during processRequest()'
                });
                return;
            })
            .on('afterConversion', function(parsedFormula) {

                var mmlsvg = '<span style="position: absolute !important; top: 0; left: 0; clip: rect(1px 1px 1px 1px);' +
                'padding: 1px 0 0 0!important; border: 0!important; height: 1px!important; width: 1px!important;' +
                'overflow: hidden!important; display: block !important; -webkit-touch-callout: none; -webkit-user-select: none;' +
                '-khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"> ' +
                parsedFormula.outputFormula.mml + '</span>';
                parsedFormula.node.insertAdjacentHTML('beforeend', mmlsvg);
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
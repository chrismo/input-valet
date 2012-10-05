describe("InputValet", function () {

    describe('small cases', function () {
        it('2 digit separated by space', function () {
            var inputValet = new InputValet({regexes:[/(\d)(\d)/], separator:' '});
            expect(inputValet.formattedValue("12")).toEqual('1 2');
        });

        it('short but correct so far', function () {
            var inputValet = new InputValet({regexes:[/(\d)(\d)/], separator:' '});
            expect(inputValet.formattedValue("1")).toEqual(null);
        });

        it('short but incorrect so far', function () {
            var inputValet = new InputValet({regexes:[/(\d)(\d)/], separator:' '});
            expect(inputValet.formattedValue("A")).toEqual(null);
        });

        it('too long but correct gets truncated', function () {
            var inputValet = new InputValet({regexes:[/(\d)(\d)/], separator:' '});
            expect(inputValet.formattedValue("123")).toEqual('1 2');
        });
    });

    describe('no separator', function () {
        it('with match', function () {
            var inputValet = new InputValet({regexes:[/\d/]});
            expect(inputValet.formattedValue("12")).toEqual('1');
        });

        it('no match', function () {
            var inputValet = new InputValet({regexes:[/\d/]});
            expect(inputValet.formattedValue("ab")).toEqual(null);
        });
    });

    describe('postProcessing', function () {
        it('should call postProcessing method if set', function () {
            var inputValet = new InputValet({regexes:[/\w/], postProcess:function (value) {
                return value.toUpperCase();
            }});
            expect(inputValet.formattedValue("ab")).toEqual('A');
        });

        it('should not call postProcessing method if set but formattedValue is null', function () {
            var inputValet = new InputValet({regexes:[/\d/], postProcess:function (value) {
                return value.toUpperCase();
            }});
            expect(inputValet.formattedValue("ab")).toEqual(null);
        });
    });

    describe('preProcessing', function () {
        it('should call preProcessing method if set', function () {
            var inputValet = new InputValet({regexes:[/[A-Z]/], preProcess:function (value) {
                return value.toUpperCase();
            }});
            expect(inputValet.formattedValue("ab")).toEqual('A');
        });

        it('should not call preProcessing method if set but curValue is null', function () {
            var inputValet = new InputValet({regexes:[/[A-Z]/], preProcess:function (value) {
                return value.toUpperCase();
            }});
            expect(inputValet.formattedValue("")).toEqual(null);
        });
    });
});

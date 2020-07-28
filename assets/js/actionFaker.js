import bookStatus from './steps/components/bookStatus';
let fakeBooks = [
    {
        id: '897920432-9',
        writer: 'Robert Fisker',
        title: 'Piraternes kyst'
    },
    {
        id: '901477270-X',
        writer: 'Katarina von Bredow',
        title: 'Ellinor'
    },
    {
        id: '278193061-X',
        writer: 'Sanne Søndergaard',
        title: 'Se mig'
    },
    {
        id: '050234629-9',
        writer: 'Katja Brandis',
        title: 'Woodwalkers - Carags forvandling'
    },
    {
        id: '946616542-9',
        writer: 'Andreas Bræstrup Kirstein, Rasmus Bregnhøi',
        title: 'Poul og far på fisketur'
    },
    {
        id: '899174414-1',
        writer: 'Maja Plesner',
        title: 'Jada'
    },
    {
        id: '978833685-X',
        writer: 'Christian Mohr Boisen',
        title: 'De største fodboldlegender'
    },
    {
        id: '136191915-9',
        writer: 'Josefine Ottesen',
        title: 'Golak'
    },
    {
        id: '408710506-7',
        writer: 'Jenny Han',
        title: 'PS: Jeg elsker dig stadig'
    },
    {
        id: '959467878-X',
        writer: 'Sebastian Klein og Rikke Klein',
        title: 'Verdens farligste slanger'
    },
    {
        id: '655116448-X',
        writer: 'Marie Lu',
        title: 'Warcross : spiller, jæger, hacker, brik'
    },
    {
        id: '708486678-7',
        writer: 'Dorte Roholte',
        title: 'Mærkelige Mynthe'
    },
    {
        id: '328922037-0',
        writer: 'Tamora Pierce',
        title: 'Venner & Fjender'
    },
    {
        id: '288561858-2',
        writer: 'Gry Kappel Jensen',
        title: 'Roser og violer'
    },
    {
        id: '275751388-5',
        writer: 'John Flanagan',
        title: 'De uønskede'
    },
    {
        id: '107235036-X',
        writer: 'Siri Pettersen',
        title: 'Boble'
    },
    {
        id: '286152951-2',
        writer: 'Nanna Foss',
        title: 'Spektrum - Leoniderne'
    }
];
    export function fakeHandleAction(action, context) {


        function getRandomHandinBook() {
            const bookToReturn =
          context.loanedBooks.get[Math.floor(Math.random() * context.loanedBooks.get.length)];
            return bookToReturn;
        }
        function getRandomHandinStatus() {
            const statusses = [
                bookStatus.HANDED_IN,
                bookStatus.HANDED_IN,
                bookStatus.HANDED_IN,
                bookStatus.RESERVED_FOR_SOMEONE_ELSE
            ];
            const statusToReturn =
          statusses[Math.floor(Math.random() * statusses.length)];
            return statusToReturn;
        }
        function handleBookHandin(book) {
            book.status = getRandomStatus();
            let justLoanedMaterials = context.justLoanedBooks.get;
            justLoanedMaterials = justLoanedMaterials.filter((fakeBook) => book.id !== fakeBook.id);
            justLoanedMaterials.push(book);
            context.justLoanedBooks.set(justLoanedMaterials);
            let allLoanedBooks = context.loanedBooks.get;
            allLoanedBooks.push(book)
            context.loanedBooks.set(allLoanedBooks);

            let justHandedInMaterials = context.justHandedInBooks.get
            justHandedInMaterials = justHandedInMaterials.filter((fakeBook) => book.id !== fakeBook.id);
            book.status = getRandomHandinStatus();
            justHandedInMaterials.push(book)
            context.justHandedInBooks.set(justHandedInMaterials)

            let remainingLoanedBooks = context.loanedBooks.get;

            remainingLoanedBooks = remainingLoanedBooks.filter(
                (fakeBook) => book.id !== fakeBook.id
            );
            context.loanedBooks.set(remainingLoanedBooks);
        }

        function getRandomBook() {
            const bookToReturn = fakeBooks[Math.floor(Math.random() * fakeBooks.length)];
            fakeBooks = fakeBooks.filter((book) => book.id !== bookToReturn.id);
            return bookToReturn;
        }
    
        function getRandomStatus() {
            const statusses = [
                bookStatus.LOANED,
                bookStatus.LOANED,
                bookStatus.LOANED,
                bookStatus.RESERVED_FOR_SOMEONE_ELSE
            ];
            const statusToReturn =
          statusses[Math.floor(Math.random() * statusses.length)];
            return statusToReturn;
        }
        function handleBookLoan(book) {
            book.status = getRandomStatus();
            let justLoanedMaterials = context.justLoanedBooks.get;
            justLoanedMaterials = justLoanedMaterials.filter((fakeBook) => book.id !== fakeBook.id);
            justLoanedMaterials.push(book);
            context.justLoanedBooks.set(justLoanedMaterials);
            let allLoanedBooks = context.loanedBooks.get;
            allLoanedBooks.push(book)
            context.loanedBooks.set(allLoanedBooks);
        }


        let step = "";
        switch(action) {
            
            case "logout":
                context.justLoanedBooks.set([])
                context.justHandedInBooks.set([])
                context.username.set("")
                context.loggedIn.set(false)
                context.step.set("initial")
                break;
                case "login":
                    context.justLoanedBooks.set([])
                    context.justHandedInBooks.set([])
                    context.username.set("Sine")
                    let flow = context.flow.get ? context.flow.get  : "borrow" 
                    context.step.set(flow)
                    context.loggedIn.set(true)
                    break;

                case "status":
                    context.justLoanedBooks.set([])
                    context.justHandedInBooks.set([])
                    context.flow.set("status")
                    step = context.loggedIn.get ? "status" : "login"
                    context.step.set(step)
                    break;

                case "borrow":
                    context.justLoanedBooks.set([])
                    context.justHandedInBooks.set([])
                    context.flow.set("borrow")
                    step = context.loggedIn.get ? "borrow" : "login"
                    context.step.set(step)
                    break;

                    case "handin":
                        context.justLoanedBooks.set([])
                        context.flow.set("handin")
                        step = context.loggedIn.get ? "handin" : "login"
                        context.step.set(step)

                        break;
                        case "loanMaterial":
                            let book = getRandomBook();
                            context.scannedBarcode.set(book.id);
                            book.status = bookStatus.WAITING_FOR_INFO;
                            let justLoanedMaterials = context.justLoanedBooks.get;
                            justLoanedMaterials.push(book);
                            context.justLoanedBooks.set(justLoanedMaterials);
                            setTimeout(handleBookLoan, 2000, book);
                            break;
                            case "handinMaterial":
                                book = getRandomHandinBook();
                                context.scannedBarcode.set(book.id);
                                book.status = bookStatus.WAITING_FOR_INFO;
                                const justHandedInMaterials = context.justHandedInBooks.get;
                                justHandedInMaterials.push(book)
                                context.justHandedInBooks.set(justHandedInMaterials)
                                setTimeout(handleBookHandin, 2000, book);
                                break;
          }
    }



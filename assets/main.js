const dataCache = [
    {
        id: 1,
        date: '2022-07-20',
        path: 'events/2022-07-20',
        speakers: ['Toshi Omagari', 'Emma Luczyn'],
        venue: 'The Lansdown, Clifton'
    },
    {
        id: 2,
        date: '2022-09-21',
        path: 'events/2022-09-21',
        speakers: ['Fyonafinn', 'Athena Cauley-Yu', 'Tobias Newbigin'],
        venue: 'The Stag &amp; Hounds, Old Market'
    },
    {
        id: 3,
        date: '2022-11-23',
        path: 'events/2022-11-23',
        speakers: ['Tozer', 'Nick Hand'],
        venue: 'Greenbank, Easton'
    },
    {
        id: 4,
        date: '2023-01-18',
        path: 'events/2023-01-18',
        speakers: ['Flora Fricker', 'Jamie Clarke'],
        venue: 'Gather Round, St. Paul’s'
    },
    {
        id: 5,
        date: '2023-03-22',
        path: 'events/2023-03-22',
        speakers: ['Elliot Jay Stocks', 'Sophia Tai', 'Ellen Bills'],
        venue: 'Letterpress Collective'
    },
    {
        id: 6,
        date: '2023-05-17',
        path: 'events/2023-05-17',
        speakers: ['Rhiannon Daniels', 'John McTague', 'Stephen Glendinning'],
        venue: 'The Lansdown, Clifton'
    },
    {
        id: 7,
        date: '2023-06-29',
        path: 'events/2023-06-29',
        speakers: ['Josh Saunders', 'Filip Paldia'],
        venue: 'Walcot Chapel, Bath'
    },
    {   
        id: 8,
        date: null,
        speakers: ['Speakers to be announced'],
        venue: 'Venue to be announced'    
    }
];

// Get images for a path, starting at image0.jpg
// Return a markup string
const getImageMarkup = async (path) => {
    let imageNum = 0;
    let moreImages = true;
    let markup = '';
    markup += `<img src="${path}/tile.jpg" height="300">`;
    while (moreImages) {
        const imagePath = path + '/image-' + imageNum + '.jpg';
        const response = await fetch(imagePath);
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer) {
                markup += `<img src="${imagePath}" height="300">`;
            }
            imageNum++;
        } else {
            moreImages = false;
        }
    }
    return markup;
};

async function init() {
    // Transform data into events
    let events = dataCache.sort((a, b) => {
        // Sort events by reverse date
        return b.id - a.id;
    });

    // We use the index to display up to 5
    // different background letters
    let bgIndex = 1;

    for (let [index, event] of events.entries()) {

        const eventTitle = `Letter Luvvers #${event.id}`;
        let eventDate = null;
        
        if (event.date) {
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let date  = new Date(event.date);
            eventDate = `<em>${date.toLocaleDateString("en-GB", options)}</em><br>`
        } else {
            eventDate = `<em>Upcoming!</em><br>`;
        }

        let imageMarkup = null;

        if (event.path) {
            imageMarkup = await getImageMarkup(event.path);
        }

        let eventMarkup = `
                <div class="row row-${index + 1} container">
                    <div class="event-listing">
                        <div class="information">
                            <h2>${eventTitle}</h2>
                            ${eventDate}
                            ${event.speakers.join(', ')}</strong><br>
                            ${event.venue}<br>
                        </div>
                        <div class="scroller-wrapper">
                            <div class="scroller">
                                ${imageMarkup ? imageMarkup : ''}
                            </div>
                            <div class="fade"></div>
                        </div>
                    </div>
                    <style>.row-${event.id}:before { background-image: url('assets/images/${bgIndex}.svg'); }</style>
                </div>`;

        bgIndex = bgIndex == 4 ? 1 : bgIndex + 1;

        const eventsDiv = document.querySelector('#events-listing');
        eventsDiv.innerHTML += eventMarkup;

    }

}



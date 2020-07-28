import Head from 'next/head'
import fetch from 'node-fetch'

import Emoji from '../src/components/emoji'
import Title from '../src/components/title'
import Description from '../src/components/description'
import Grid from '../src/components/grid'
import Card from '../src/components/card'
import Footer from '../src/components/footer'

function Home ({ ideas } ) {
	return (
		<div className="container">
			<Head>
				<title>¿Cómo mejorarías la uni?</title>
				<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👩‍🎓</text></svg>" />
			</Head>

			<main>
				<Emoji emoji="👩‍🎓" />
				<Title text="¿Cómo mejorarías la uni?" />
				<Description text="Manda cualquier cambio que podría ayudar a mejorar la enseñanza en las universidades" />

				<a href="https://forms.gle/PyTbwVGHkW4XurDC7" target="_blank" rel="noopener">
					<h3>Nueva propuesta &rarr;</h3>
				</a>

				<Grid>
					{
						ideas.map(idea => (
							<Card key={idea.title} title={idea.title} description={idea.description} />
						))
					}
				</Grid>
			</main>

			<Footer />

			<style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
					Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
				}

				.container {
					min-height: 100vh;
					padding: 0 0.5rem;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				main {
					padding: 5rem 0;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				* {
					box-sizing: border-box;
				}

				a {
					color: inherit;
					text-decoration: none;
				  }
		
				  a:hover {
					color: #0070f3;
				  }
		
			`}</style>
		</div>
	)
}

export async function getServerSideProps() {

    const res = await fetch('https://spreadsheets.google.com/feeds/list/1SCEDT56XxTqB-QO0ZdrMheQG-lI9T43mUOFOU1BpAFI/1/public/basic?alt=json')
    const data = await res.json();

    const ideas = [];

    for (let index = 0; index < data.feed.entry.length; index++) {
      const title = data.feed.entry[index].content.$t;

      var fields = title.split(", descripciónlargadelaidea: ");
      var response1 = fields[0];
      var response2 = fields[1];

      response1 = response1.replace("títulocortodelaidea: ","");

      const idea = new Object();
      idea.title = response1;
      idea.description = response2;

      ideas[index] = idea;

    }
    
    return { 
      props: {
        ideas
      }
    }
  }


export default Home

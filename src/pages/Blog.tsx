import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Pagination,
  Chip,
  Button,
  Modal
} from '@mui/material';

import zahnreinigungImage from '../assets/Die Bedeutung regelmäßiger Zahnreinigung.jpg';
import zahnaufhellungImage from '../assets/Moderne Methoden der Zahnaufhellung.jpg';
import zahnimplantateImage from '../assets/Mythen und Fakten über Zahnimplantate.jpg';
import ernährungImage from '../assets/Ernährung für gesunde Zähne.jpg';
import richtigeZahnbürsteWählenImage from '../assets/Die richtige Zahnbürste wählen.jpg';

const blogPosts = [
  {
    id: 1,
    title: 'Die Bedeutung regelmäßiger Zahnreinigung',
    excerpt: 'Erfahren Sie, warum die tägliche Zahnreinigung für Ihre Mundgesundheit von entscheidender Bedeutung ist.',
    image: zahnreinigungImage,
    category: 'Prävention',
    content: `Die regelmäßige Zahnreinigung ist der Grundstein für eine gute Mundgesundheit und ein strahlendes Lächeln. Viele Menschen unterschätzen jedoch ihre Wichtigkeit oder führen sie nicht gründlich genug durch. In diesem Beitrag erklären wir, warum die tägliche Zahnpflege so entscheidend ist und wie Sie sie optimal gestalten können.

    Zunächst einmal dient die Zahnreinigung dazu, Plaque und Bakterien zu entfernen, die sich im Laufe des Tages auf unseren Zähnen ansammeln. Diese Bakterien ernähren sich von Zuckerresten in unserem Mund und produzieren dabei Säuren, die den Zahnschmelz angreifen und zu Karies führen können. Durch regelmäßiges Zähneputzen unterbrechen wir diesen Prozess und schützen unsere Zähne vor Schäden.

    Aber nicht nur Karies kann durch gute Mundhygiene verhindert werden. Auch Zahnfleischerkrankungen wie Gingivitis und Parodontitis lassen sich durch regelmäßige Zahnreinigung vorbeugen. Diese Erkrankungen beginnen oft unbemerkt und können im fortgeschrittenen Stadium sogar zum Zahnverlust führen.

    Um Ihre Zähne optimal zu pflegen, sollten Sie mindestens zweimal täglich für zwei Minuten Ihre Zähne putzen. Verwenden Sie dabei eine weiche Zahnbürste und eine fluoridhaltige Zahnpasta. Die Zahnbürste sollte in einem 45-Grad-Winkel zum Zahnfleischrand angesetzt und mit sanften, kreisenden Bewegungen geführt werden. Vergessen Sie dabei nicht, alle Zahnflächen – außen, innen und die Kauflächen – zu reinigen.

    Zusätzlich zum Zähneputzen ist die Verwendung von Zahnseide oder Interdentalbürsten wichtig, um auch die Zahnzwischenräume zu reinigen, die von der Zahnbürste nicht erreicht werden. Dies sollte mindestens einmal täglich erfolgen, idealerweise abends vor dem Zähneputzen.

    Eine professionelle Zahnreinigung beim Zahnarzt ein- bis zweimal im Jahr ergänzt Ihre häusliche Zahnpflege optimal. Dabei werden auch hartnäckige Ablagerungen entfernt, die sich mit der Zahnbürste allein nicht beseitigen lassen.

    Denken Sie daran: Ihre Mundgesundheit beeinflusst Ihr gesamtes Wohlbefinden. Eine gute Zahnpflege kann nicht nur Zahnprobleme verhindern, sondern auch das Risiko für andere Erkrankungen wie Herz-Kreislauf-Erkrankungen reduzieren. Investieren Sie also täglich ein paar Minuten in Ihre Zahngesundheit – Ihr Lächeln wird es Ihnen danken!`
  },
  {
    id: 2,
    title: 'Moderne Methoden der Zahnaufhellung',
    excerpt: 'Ein Überblick über die effektivsten und sichersten Methoden der Zahnaufhellung in der modernen Zahnmedizin.',
    image: zahnaufhellungImage,
    category: 'Ästhetik',
    content: `Ein strahlendes Lächeln ist für viele Menschen ein wichtiger Aspekt ihres Erscheinungsbildes und ihres Selbstbewusstseins. Kein Wunder also, dass Zahnaufhellung zu den beliebtesten kosmetischen Zahnbehandlungen zählt. In diesem Artikel stellen wir Ihnen die modernsten und effektivsten Methoden der professionellen Zahnaufhellung vor.

    Die In-Office-Bleaching-Behandlung ist eine der schnellsten und effektivsten Methoden zur Zahnaufhellung. Hierbei wird ein hochkonzentriertes Bleichmittel auf die Zähne aufgetragen und mit Hilfe einer speziellen Lampe oder eines Lasers aktiviert. Diese Methode kann die Zähne in nur einer Sitzung um mehrere Nuancen aufhellen. Der Vorteil dieser Methode liegt in der schnellen Wirkung und der professionellen Durchführung, die Nebenwirkungen minimiert.

    Eine weitere beliebte Methode ist das Home-Bleaching unter zahnärztlicher Aufsicht. Hierbei werden individuell angepasste Schienen angefertigt, die der Patient zu Hause mit einem Aufhellungsgel befüllt und für einige Stunden täglich oder über Nacht trägt. Diese Methode ist zwar langsamer als das In-Office-Bleaching, dafür aber schonender und erlaubt es dem Patienten, die Behandlung flexibel in seinen Alltag zu integrieren.

    Für leichte Verfärbungen oder zur Auffrischung zwischen den professionellen Behandlungen gibt es auch Aufhellungsstreifen oder -stifte für den Heimgebrauch. Diese sind zwar weniger effektiv als die professionellen Methoden, können aber bei regelmäßiger Anwendung durchaus sichtbare Ergebnisse erzielen.

    Eine relativ neue Methode ist die Ultraschall-Zahnaufhellung. Hierbei wird das Bleichmittel durch Ultraschallwellen aktiviert, was zu einer besonders gleichmäßigen und schonenden Aufhellung führt. Diese Methode ist besonders für Patienten mit empfindlichen Zähnen geeignet.

    Unabhängig von der gewählten Methode ist es wichtig zu beachten, dass eine professionelle Zahnreinigung vor der Aufhellung empfehlenswert ist. So können Verfärbungen und Ablagerungen entfernt werden, was das Ergebnis der Aufhellung verbessert.

    Es ist auch wichtig zu wissen, dass nicht jede Verfärbung gleich gut auf eine Aufhellung anspricht. Während Verfärbungen durch Kaffee, Tee oder Rotwein in der Regel gut aufgehellt werden können, sind innere Verfärbungen, etwa durch Medikamente, oft schwieriger zu behandeln.

    Nach der Aufhellung ist eine gute Mundpflege besonders wichtig, um das Ergebnis möglichst lange zu erhalten. Auch sollten stark färbende Lebensmittel und Getränke in den ersten Tagen nach der Behandlung vermieden werden.

    Letztendlich ist die Wahl der richtigen Aufhellungsmethode eine individuelle Entscheidung, die von Faktoren wie dem Grad der Verfärbung, der Zahnempfindlichkeit und den persönlichen Vorlieben abhängt. Ein Beratungsgespräch mit Ihrem Zahnarzt hilft Ihnen, die für Sie am besten geeignete Methode zu finden.`
  },
  {
    id: 3,
    title: 'Mythen und Fakten über Zahnimplantate',
    excerpt: 'Wir räumen mit verbreiteten Mythen über Implantate auf und erklären, wie der Eingriff tatsächlich abläuft.',
    image: zahnimplantateImage,
    category: 'Implantologie',
    content: `Zahnimplantate haben in den letzten Jahrzehnten die Zahnmedizin revolutioniert und bieten eine hervorragende Möglichkeit, verlorene Zähne zu ersetzen. Trotzdem ranken sich viele Mythen und Missverständnisse um dieses Thema. In diesem Artikel wollen wir einige der häufigsten Mythen aufklären und Fakten über Zahnimplantate präsentieren.

    Mythos 1: "Zahnimplantate sind extrem schmerzhaft."
    Fakt: Entgegen der weit verbreiteten Meinung ist der Eingriff in der Regel weniger schmerzhaft als eine Zahnextraktion. Die Operation wird unter lokaler Betäubung durchgeführt, und viele Patienten berichten von nur geringen Unannehmlichkeiten nach dem Eingriff. Moderne Techniken und Materialien haben dazu beigetragen, den Prozess noch schonender zu gestalten.

    Mythos 2: "Zahnimplantate sind sehr teuer und nur für Reiche erschwinglich."
    Fakt: Während Zahnimplantate in der Tat eine Investition darstellen, sind sie langfristig oft kostengünstiger als andere Zahnersatzoptionen. Implantate können bei guter Pflege ein Leben lang halten, während Brücken oder Prothesen regelmäßig ersetzt oder angepasst werden müssen. Viele Zahnärzte bieten auch Finanzierungsmöglichkeiten an.

    Mythos 3: "Jeder kann Zahnimplantate bekommen."
    Fakt: Obwohl Implantate für viele Menschen eine ausgezeichnete Option sind, sind sie nicht für jeden geeignet. Faktoren wie Knochendichte, allgemeine Gesundheit und Rauchgewohnheiten spielen eine Rolle. Eine gründliche Untersuchung und Beratung durch einen Implantologen ist unerlässlich, um die Eignung festzustellen.

    Mythos 4: "Die Einheilungszeit für Implantate dauert sehr lange."
    Fakt: Die Einheilungszeit variiert von Patient zu Patient, aber moderne Techniken haben sie erheblich verkürzt. In vielen Fällen kann ein provisorischer Zahnersatz sofort nach der Implantation angebracht werden, sodass keine sichtbare Zahnlücke bleibt.

    Mythos 5: "Implantate erfordern eine spezielle Pflege."
    Fakt: Zahnimplantate benötigen im Grunde die gleiche Pflege wie natürliche Zähne: regelmäßiges Zähneputzen, Verwendung von Zahnseide und regelmäßige Kontrollbesuche beim Zahnarzt. Es sind keine speziellen Pflegeprodukte erforderlich.

    Wie läuft nun eine Implantation tatsächlich ab? Der Prozess beginnt mit einer gründlichen Untersuchung und Planung. Mittels 3D-Röntgen wird die optimale Position für das Implantat bestimmt. In einem chirurgischen Eingriff wird das Implantat dann in den Kieferknochen eingesetzt. In den folgenden Wochen verwächst das Implantat mit dem Knochen (Osseointegration). Sobald dieser Prozess abgeschlossen ist, wird eine Krone auf das Implantat gesetzt.

    Die Erfolgsquote von Zahnimplantaten ist sehr hoch - über 95% bei gesunden Patienten. Sie bieten zahlreiche Vorteile: Sie fühlen und sehen aus wie natürliche Zähne, verhindern den Abbau des Kieferknochens und beeinträchtigen im Gegensatz zu Brücken nicht die Nachbarzähne.

    Zusammenfassend lässt sich sagen, dass Zahnimplantate eine sichere und effektive Methode zum Ersatz fehlender Zähne sind. Wie bei jeder medizinischen Behandlung ist es wichtig, sich umfassend beraten zu lassen und Entscheidungen auf der Grundlage von Fakten und nicht von Mythen zu treffen.`
  },
    {
      id: 4,
      title: 'Ernährung für gesunde Zähne',
      excerpt: 'Welche Lebensmittel sind gut für die Zähne und welche sollte man meiden? Tipps für eine zahngesunde Ernährung.',
      image: ernährungImage,
      category: 'Ernährung',
      content: `Eine ausgewogene Ernährung spielt eine entscheidende Rolle für die Gesundheit unserer Zähne. Was wir essen und trinken, beeinflusst nicht nur unseren Körper, sondern hat auch direkten Einfluss auf unsere Mundgesundheit. In diesem Artikel möchten wir Ihnen zeigen, welche Lebensmittel besonders gut für Ihre Zähne sind und welche Sie besser meiden sollten.
    
    Zahnfreundliche Lebensmittel:
    
    1. Käse und Milchprodukte: Reich an Kalzium und Phosphat, stärken diese den Zahnschmelz. Zudem regt Käse die Speichelproduktion an, was hilft, Säuren im Mund zu neutralisieren. Besonders empfehlenswert sind harte Käsesorten wie Cheddar oder Gouda.
    
    2. Knackiges Gemüse: Karotten, Sellerie und Äpfel haben eine reinigende Wirkung auf die Zähne. Beim Kauen wird mehr Speichel produziert, der ebenfalls reinigend wirkt und Bakterien wegspült. Zusätzlich massieren diese Lebensmittel das Zahnfleisch und fördern so die Durchblutung.
    
    3. Grünes Blattgemüse: Spinat, Grünkohl und andere Blattgemüse sind reich an Calcium und Ballaststoffen. Das Calcium stärkt die Zähne, während die Ballaststoffe die Speichelproduktion anregen und so zur natürlichen Reinigung beitragen.
    
    4. Nüsse: Sie enthalten wichtige Mineralien wie Phosphor und Kalzium, die für gesunde Zähne unerlässlich sind. Besonders Walnüsse und Mandeln sind aufgrund ihres hohen Mineralstoffgehalts empfehlenswert.
    
    5. Wasser: Es spült Essensreste weg und verdünnt zahnschädliche Säuren im Mund. Besonders nach dem Genuss säurehaltiger Speisen ist es ratsam, den Mund mit Wasser auszuspülen.
    
    6. Grüner und schwarzer Tee: Diese enthalten Polyphenole, die das Wachstum von Bakterien hemmen können. Zudem enthält grüner Tee Fluorid, das den Zahnschmelz stärkt.
    
    Lebensmittel, die man meiden oder einschränken sollte:
    
    1. Zucker und Süßigkeiten: Bakterien im Mund wandeln Zucker in Säuren um, die den Zahnschmelz angreifen. Besonders problematisch sind klebrige Süßigkeiten wie Karamell oder Gummibärchen, die lange an den Zähnen haften bleiben.
    
    2. Saure Lebensmittel: Zitrusfrüchte, Essig und Softdrinks können den Zahnschmelz direkt angreifen und ihn mit der Zeit abnutzen. Das macht die Zähne anfälliger für Karies und Überempfindlichkeit. Wenn Sie diese Lebensmittel genießen, spülen Sie danach den Mund mit Wasser aus.
    
    3. Stärkehaltige Lebensmittel: Chips, Weißbrot und andere stark verarbeitete Kohlenhydrate können sich in den Zahnzwischenräumen festsetzen und dort zu Karies führen. Vollkornprodukte sind hier die bessere Alternative.
    
    4. Alkohol: Übermäßiger Alkoholkonsum kann den Mund austrocknen und so die schützende Wirkung des Speichels reduzieren. Zudem enthalten viele alkoholische Getränke viel Zucker.
    
    Tipps für eine zahnfreundliche Ernährungsweise:
    
    1. Mahlzeiten statt Snacks: Häufiges Snacken über den Tag verteilt gibt den Bakterien im Mund ständig Nahrung. Besser ist es, sich auf wenige Hauptmahlzeiten zu beschränken.
    
    2. Wasser trinken: Spülen Sie Ihren Mund nach jeder Mahlzeit mit Wasser aus. Das hilft, Essensreste zu entfernen und den pH-Wert im Mund zu normalisieren.
    
    3. Käse zum Dessert: Ein Stück Käse nach der Mahlzeit kann helfen, den Säuregehalt im Mund zu neutralisieren und den Zahnschmelz zu remineralisieren.
    
    4. Kaugummi kauen: Zuckerfreier Kaugummi regt die Speichelproduktion an und kann so nach einer Mahlzeit zur Mundreinigung beitragen. Achten Sie auf Kaugummis mit Xylitol, das kariesfördernde Bakterien reduzieren kann.
    
    5. Richtige Reihenfolge: Wenn Sie säurehaltige Lebensmittel konsumieren, tun Sie dies am besten während einer Hauptmahlzeit und nicht als separaten Snack. So wird die Säure schneller neutralisiert.
    
    6. Warten mit dem Zähneputzen: Nach dem Genuss saurer Speisen sollten Sie etwa 30 Minuten mit dem Zähneputzen warten, da der Zahnschmelz durch die Säure vorübergehend erweicht ist.
    
    Es ist wichtig zu verstehen, dass eine zahngesunde Ernährung nicht bedeutet, auf alle Genüsse verzichten zu müssen. Es geht vielmehr darum, bewusst zu essen und die Häufigkeit potenziell schädlicher Lebensmittel zu begrenzen. Kombinieren Sie Ihre zahnfreundliche Ernährung mit guter Mundhygiene und regelmäßigen Zahnarztbesuchen, um Ihre Zahngesundheit langfristig zu erhalten.
    
    Denken Sie daran: Jede Mahlzeit ist eine Chance, etwas Gutes für Ihre Zähne zu tun. Mit den richtigen Lebensmitteln und einer ausgewogenen Ernährung können Sie nicht nur Ihre allgemeine Gesundheit fördern, sondern auch zu einem strahlenden und gesunden Lächeln beitragen.`
    },
    {
      id: 5,
      title: 'Die richtige Zahnbürste wählen',
      excerpt: 'Ein Leitfaden zur Auswahl der richtigen Zahnbürste: Worauf Sie beim Kauf achten sollten.',
      image: richtigeZahnbürsteWählenImage,
      category: 'Hygiene',
      content: `Die Wahl der richtigen Zahnbürste ist ein wesentlicher Aspekt der täglichen Mundhygiene. Eine gute Zahnbürste ist das Fundament für gesunde Zähne und ein strahlendes Lächeln. Doch angesichts der Vielzahl von Optionen auf dem Markt kann die Auswahl überwältigend sein. In diesem Leitfaden erklären wir Ihnen, worauf Sie beim Kauf einer Zahnbürste achten sollten.
    
    1. Härtegrad der Borsten:
    Eine der wichtigsten Entscheidungen beim Kauf einer Zahnbürste betrifft die Härte der Borsten. Die meisten Zahnärzte empfehlen weiche bis mittelharte Borsten. Weiche Borsten sind schonend zum Zahnfleisch und können Zähne und Zahnfleisch effektiv reinigen, ohne den Zahnschmelz zu beschädigen oder das Zahnfleisch zu reizen. Harte Borsten können bei zu kräftigem Druck das Zahnfleisch verletzen und den Zahnschmelz abnutzen.
    
    2. Bürstenkopfgröße:
    Der Bürstenkopf sollte klein genug sein, um alle Bereiche des Mundes bequem zu erreichen, einschließlich der hinteren Backenzähne. Für die meisten Erwachsenen ist ein Bürstenkopf von etwa 1 cm breit und 2 cm lang ideal. Kinder und Personen mit kleinem Mund sollten entsprechend kleinere Bürstenköpfe wählen.
    
    3. Griff:
    Der Griff der Zahnbürste sollte bequem in der Hand liegen und einen festen Halt bieten. Viele moderne Zahnbürsten haben ergonomisch geformte Griffe, die das Bürsten erleichtern. Für Personen mit eingeschränkter Handbeweglichkeit können Zahnbürsten mit dickeren Griffen hilfreich sein.
    
    4. Elektrisch oder manuell:
    Sowohl manuelle als auch elektrische Zahnbürsten können effektiv reinigen, wenn sie richtig verwendet werden. Elektrische Zahnbürsten können besonders nützlich sein für:
       - Menschen mit eingeschränkter Beweglichkeit
       - Personen, die dazu neigen, zu fest zu schrubben (viele elektrische Modelle haben Drucksensoren)
       - Kinder, die das Zähneputzen spannend finden sollen
    
    Elektrische Zahnbürsten gibt es in verschiedenen Ausführungen:
       - Rotierende Bürstenköpfe
       - Schallzahnbürsten
       - Ultraschallzahnbürsten
    
    Jede Art hat ihre Vor- und Nachteile, und die Wahl hängt oft von persönlichen Vorlieben ab.
    
    5. Zusatzfunktionen:
    Moderne Zahnbürsten, insbesondere elektrische Modelle, können mit verschiedenen Zusatzfunktionen ausgestattet sein:
       - Timer für die empfohlene Putzzeit von zwei Minuten
       - Drucksensoren, die warnen, wenn zu fest gedrückt wird
       - Verschiedene Putzmodi für sensitive Zähne, Zahnfleischmassage etc.
       - Verbindung mit Smartphone-Apps für Feedback und Motivation
    
    Diese Funktionen können hilfreich sein, sind aber nicht unbedingt notwendig für eine effektive Mundhygiene.
    
    6. Austauschintervall:
    Unabhängig davon, ob Sie sich für eine manuelle oder elektrische Zahnbürste entscheiden, sollten Sie diese regelmäßig austauschen. Die meisten Zahnärzte empfehlen, die Zahnbürste oder den Bürstenkopf alle drei Monate zu wechseln oder früher, wenn die Borsten ausgefranst sind.
    
    7. Umweltaspekte:
    Angesichts wachsender Umweltbedenken entscheiden sich immer mehr Menschen für nachhaltige Optionen. Zahnbürsten aus Bambus oder mit austauschbaren Köpfen können eine umweltfreundlichere Alternative zu herkömmlichen Plastikzahnbürsten sein.
    
    8. Spezielle Bedürfnisse:
    Für Menschen mit besonderen Bedürfnissen gibt es spezielle Zahnbürsten:
       - Zahnbürsten mit drei Seiten für eine gründlichere Reinigung
       - Zahnbürsten mit extra weichen Borsten für empfindliches Zahnfleisch
       - Zahnbürsten mit größeren Griffen für Menschen mit Arthritis
    
    9. Preisgestaltung:
    Zahnbürsten gibt es in verschiedenen Preisklassen. Teurere Modelle bieten oft mehr Funktionen, aber eine gute Mundhygiene ist auch mit einer einfachen, preiswerten Zahnbürste möglich, wenn sie richtig verwendet wird.
    
    Zusammenfassend lässt sich sagen, dass die beste Zahnbürste diejenige ist, die Sie gerne und regelmäßig benutzen. Experimentieren Sie mit verschiedenen Optionen, um herauszufinden, welche Zahnbürste für Sie am angenehmsten ist und die besten Ergebnisse liefert. Denken Sie daran, dass die Technik beim Zähneputzen genauso wichtig ist wie die Wahl der Zahnbürste. Fragen Sie Ihren Zahnarzt nach Empfehlungen und einer Demonstration der richtigen Putztechnik.
    
    Unabhängig von der Art der Zahnbürste, die Sie wählen, ist es wichtig, zweimal täglich für zwei Minuten zu putzen, Zahnseide zu benutzen und regelmäßig Ihren Zahnarzt zu besuchen. Mit der richtigen Zahnbürste und einer guten Mundhygieneroutine sind Sie auf dem besten Weg zu einem gesunden und strahlenden Lächeln.`
    },
  ];

  const categories = ['Alle', 'Prävention', 'Ästhetik', 'Implantologie', 'Ernährung', 'Hygiene'];

const Blog: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [openPost, setOpenPost] = useState<typeof blogPosts[0] | null>(null);
  const postsPerPage = 6;

  const filteredPosts = selectedCategory === 'Alle'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleOpenPost = (post: typeof blogPosts[0]) => {
    setOpenPost(post);
  };

  const handleClosePost = () => {
    setOpenPost(null);
  };

  return (
    <Box sx={{ paddingTop: '64px' }}>
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Zahnmedizinischer Blog
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? "primary" : "default"}
            />
          ))}
        </Box>
        <Grid container spacing={4}>
          {currentPosts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea onClick={() => handleOpenPost(post)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.image}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.excerpt}
                    </Typography>
                    <Chip label={post.category} size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredPosts.length / postsPerPage)}
            page={currentPage}
            onChange={paginate}
            color="primary"
          />
        </Box>
      </Container>

      <Modal
        open={openPost !== null}
        onClose={handleClosePost}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto',
        }}>
          {openPost && (
            <>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                {openPost.title}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {openPost.content}
              </Typography>
              <Button onClick={handleClosePost} sx={{ mt: 2 }}>Schließen</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Blog;
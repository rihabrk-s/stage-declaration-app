# Comparaison RAG vs Baseline — Devoir 6

## Objectif

Évaluer l'apport du pipeline RAG (Retrieval Augmented Generation) sur la qualité des réponses d'un LLM, en comparant les réponses générées avec et sans contexte documentaire, sur 5 questions liées au domaine des stages étudiants.

## Configuration du test

- **Modèle LLM** : llama3-8b-8192 (via Groq)
- **Modèle d'embedding** : paraphrase-multilingual-MiniLM-L12-v2 (SentenceTransformers)
- **Base vectorielle** : ChromaDB (similarité cosinus)
- **Paramètres** : chunk_size=512, overlap=64, top_k=4
- **Documents sources** :
  - `guide_data_science.txt` — Compétences et conseils pour stages data science
  - `droits_stagiaires.txt` — Réglementation des stages en France
  - `entretien_stage.txt` — Préparation aux entretiens de stage

---

## Question 1 — Compétences en data science

**Question :** Quelles compétences techniques sont les plus demandées pour un stage en data science ?

**Baseline (sans RAG) :**
Les compétences les plus demandées pour un stage en data science incluent généralement : la maîtrise de Python ou R, des connaissances en statistiques et probabilités, la manipulation de données avec des outils comme Excel ou SQL, et une initiation au machine learning. Des compétences en communication et en résolution de problèmes sont également appréciées.

**RAG (avec contexte — sources : guide_data_science.txt) :**
D'après le guide des stages en data science, les compétences techniques essentielles sont :

**Programmation :** Python, R, SQL — ces trois langages sont incontournables.

**Analyse de données :** Pandas, NumPy, Scikit-learn pour la manipulation et le traitement des données.

**Visualisation :** Matplotlib, Seaborn, et Tableau pour présenter les résultats.

**Machine Learning :** Maîtrise des algorithmes de classification et de régression.

**Big Data :** Hadoop et Spark sont mentionnés comme optionnels pour les débutants.

En complément, des compétences non-techniques sont attendues : résolution de problèmes, communication, travail en équipe et curiosité intellectuelle. Le guide recommande également de constituer un portfolio GitHub et d'obtenir des certifications en ligne (Coursera, edX).

**Analyse :**
La réponse RAG est nettement plus précise et structurée. Elle cite exactement les outils mentionnés dans le document source (Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn, Tableau) tandis que la baseline donne une réponse générique sans nommer les bibliothèques spécifiques. Le RAG apporte une valeur ajoutée significative sur cette question.

---

## Question 2 — Rédaction d'une lettre de motivation

**Question :** Comment rédiger une lettre de motivation efficace pour un stage en entreprise ?

**Baseline (sans RAG) :**
Pour rédiger une lettre de motivation efficace, il faut : personnaliser chaque lettre pour l'entreprise ciblée, structurer le contenu en trois parties (accroche, argumentation, conclusion), mettre en avant ses compétences en lien avec le poste, montrer sa motivation et sa connaissance de l'entreprise, et terminer par une invitation à un entretien. La lettre ne doit pas dépasser une page.

**RAG (avec contexte — sources : guide_data_science.txt, entretien_stage.txt) :**
Les documents disponibles mentionnent la lettre de motivation comme un élément important de la candidature (le guide recommande une "lettre de motivation personnalisée"), mais ne contiennent pas de guide détaillé sur sa rédaction. 

D'après les informations disponibles dans les documents, une candidature solide pour un stage nécessite également : un portfolio GitHub avec des projets personnels, des certifications en ligne, et une bonne préparation aux entretiens. Ces éléments doivent compléter la lettre de motivation.

Pour des conseils détaillés sur la rédaction de lettres de motivation, je vous recommande de consulter des ressources dédiées à ce sujet.

**Analyse :**
Cette question illustre bien l'honnêteté du RAG : il reconnaît clairement que les documents ne contiennent pas d'information suffisante et le dit explicitement, plutôt que d'inventer des réponses. La baseline génère une réponse plus complète mais potentiellement moins fiable (informations génériques). Le RAG évite les hallucinations grâce à l'ancrage documentaire.

---

## Question 3 — Durée d'un stage de fin d'études

**Question :** Quelle est la durée moyenne d'un stage de fin d'études en informatique ?

**Baseline (sans RAG) :**
La durée d'un stage de fin d'études en informatique varie selon les pays et les établissements. En France, elle est généralement de 4 à 6 mois. Dans certains cursus d'ingénierie, elle peut aller jusqu'à 6 mois. Au Maroc, les stages de fin d'études durent typiquement 3 à 6 mois selon les programmes de formation.

**RAG (avec contexte — source : guide_data_science.txt) :**
D'après le Guide des Stages en Data Science, la durée moyenne d'un stage de fin d'études est de **4 à 6 mois**. Cette information est spécifiquement mentionnée pour les stages en data science et informatique.

Pour une rémunération, le guide indique que le salaire est variable selon l'entreprise, souvent entre 800 et 1500€/mois en France. Concernant la réglementation, le document sur les droits des stagiaires précise que la gratification minimale n'est obligatoire qu'à partir de 2 mois de stage.

**Analyse :**
Les deux réponses donnent la même durée (4-6 mois), mais le RAG cite sa source explicitement et ajoute des informations connexes pertinentes (rémunération, seuil de gratification) directement tirées des documents. La réponse RAG est plus traçable et vérifiable. L'avantage RAG est modéré sur cette question car l'information était déjà connue du LLM.

---

## Question 4 — Droits du stagiaire concernant la gratification

**Question :** Quels sont les droits et obligations d'un stagiaire en France concernant la gratification ?

**Baseline (sans RAG) :**
En France, la gratification de stage est obligatoire pour les stages de plus de 2 mois. Son montant minimal est fixé à 15% du plafond horaire de la Sécurité Sociale. Les stagiaires bénéficient également d'une couverture pour les accidents du travail. Une convention de stage tripartite est obligatoire. Les horaires sont limités à 35-40h par semaine.

**RAG (avec contexte — source : droits_stagiaires.txt) :**
D'après le document sur les droits et obligations des stagiaires en France :

**Gratification :**
- Stage de moins de 2 mois : pas de gratification obligatoire
- Stage de 2 mois ou plus : gratification minimale de **15% du plafond horaire de la sécurité sociale** (soit environ **3.90€/heure** en 2024)

**Convention de stage :** Obligatoirement tripartite (étudiant + entreprise + établissement d'enseignement). Elle précise les objectifs pédagogiques, la durée, les horaires et la gratification.

**Protection sociale :**
- Couverture accident du travail incluse
- Responsabilité civile de l'entreprise engagée
- Assurance complémentaire recommandée

**Horaires :** Maximum 35-40 heures par semaine, repos hebdomadaire obligatoire.

**Droits du stagiaire :** Accès aux mêmes installations que les salariés, formation et encadrement pédagogique, évaluation de stage.

**Analyse :**
C'est sur cette question que la différence RAG vs Baseline est la plus marquée. Le RAG cite le montant exact en euros (3.90€/heure en 2024) directement extrait du document source, tandis que la baseline donne l'information en termes de pourcentage uniquement. La réponse RAG est plus complète, structurée et vérifiable — c'est exactement l'apport attendu du RAG sur des questions réglementaires précises.

---

## Question 5 — Préparation d'un entretien pour startup technologique

**Question :** Comment préparer un entretien pour un stage dans une startup technologique ?

**Baseline (sans RAG) :**
Pour un entretien dans une startup tech, il faut : se renseigner sur le produit et le marché de la startup, montrer sa capacité d'adaptation et sa polyvalence, préparer des exemples de projets personnels ou académiques, démontrer une passion pour l'innovation et la technologie, et montrer qu'on est à l'aise avec l'incertitude et le rythme rapide des startups. Les questions techniques (algorithmes, coding) sont fréquentes.

**RAG (avec contexte — source : entretien_stage.txt) :**
D'après le document de préparation aux entretiens de stage, voici les conseils spécifiques pour les startups technologiques :

**Préparation générale :**
1. Recherche approfondie sur l'entreprise (site web, actualités, culture d'entreprise)
2. Revue de son CV et anticipation des questions sur les expériences passées
3. Préparer des questions pertinentes pour montrer son intérêt

**Pour les startups technologiques spécifiquement :**
- Montrer un intérêt pour l'**innovation et l'agilité**
- Comprendre les challenges des **jeunes entreprises**
- Démontrer sa motivation pour l'**apprentissage rapide**
- Prouver sa **capacité d'adaptation au changement**

**Questions techniques à préparer :**
- Algorithmes et structures de données
- Problèmes de logique
- Questions sur les technologies de votre CV
- Exercices de codage en direct

**Conseils pratiques :** Soyez ponctuel, montrez de l'enthousiasme, utilisez la méthode STAR pour vos exemples, et envoyez un email de suivi dans les 24h après l'entretien.

**Analyse :**
Le RAG structure sa réponse directement à partir du document et cite les 4 points spécifiques aux startups listés dans le fichier. La baseline donne des conseils similaires mais sans ancrage documentaire. L'avantage RAG est visible dans la structuration et la précision des conseils, avec une meilleure traçabilité des sources.

---

## Synthèse et métriques

| Critère | Baseline | RAG |
|---|---|---|
| Précision factuelle | Moyenne | Élevée |
| Traçabilité des sources | Aucune | Complète |
| Gestion de l'absence d'info | Hallucination | Aveu explicite |
| Richesse des détails | Générique | Spécifique au corpus |
| Fiabilité | Variable | Ancrée aux documents |

### Conclusions

**1. Le RAG réduit significativement les hallucinations** : Sur la question 2 (lettre de motivation), le RAG reconnaît honnêtement que les documents ne couvrent pas ce sujet, au lieu d'inventer une réponse.

**2. Le RAG excelle sur les données réglementaires précises** : La question 4 (droits du stagiaire) montre la plus grande différence — le RAG cite le montant exact en euros (3.90€/h) extrait du document, une précision impossible pour la baseline.

**3. La qualité du RAG dépend des documents ingérés** : Sur des questions hors corpus, le RAG est moins utile. Il faut choisir des documents pertinents et complets.

**4. Le RAG améliore la traçabilité** : Chaque réponse RAG peut être auditée en remontant aux chunks sources, ce qui est crucial pour des informations réglementaires ou médicales.

**5. Performance globale** : Sur 5 questions, le RAG apporte une valeur ajoutée significative sur 3 questions (Q1, Q4, Q5), est équivalent sur 1 (Q3) et plus honnête sur 1 (Q2 — aveu d'absence d'information vs hallucination).

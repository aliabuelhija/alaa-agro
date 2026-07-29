import React from 'react';
import { useRoute, Link } from 'wouter';
import { insights } from '../data/insights';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function InsightsPage() {
  const [match, params] = useRoute("/insights/:slug");
  
  if (match && params.slug) {
    const article = insights.find(a => a.slug === params.slug);
    
    if (!article) return <div className="pt-32 text-center">Article not found</div>;

    return (
      <div className="bg-background min-h-screen pt-32 pb-24">
        <article className="container mx-auto px-6 max-w-3xl">
          <Link href="/insights" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Insights
          </Link>
          
          <div className="mb-8">
            <span className="text-accent text-sm font-medium uppercase tracking-wider">{article.category}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mt-4 mb-6 leading-tight">{article.title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
              <span className="flex items-center gap-2"><Calendar size={16} /> {article.date}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> {article.readTime}</span>
            </div>
          </div>

          <div className="prose prose-lg prose-p:text-muted-foreground prose-headings:font-serif prose-headings:text-foreground prose-strong:text-foreground max-w-none">
            {article.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('**') && paragraph.includes('**')) {
                const parts = paragraph.split('**');
                return (
                  <p key={i}>
                    <strong>{parts[1]}</strong>
                    {parts[2]}
                  </p>
                );
              }
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
          
          <div className="mt-16 pt-8 border-t border-border bg-card p-6 rounded-xl text-center">
            <p className="text-foreground font-medium mb-4">Looking for specific agricultural commodities?</p>
            <Link href="/contact" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
              Contact Our Sales Team
            </Link>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="mb-16 md:mb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">Market Insights</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Knowledge and updates from the Russian agricultural export market. 
            <br/><span className="text-sm opacity-50">(Sample Content)</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((article, i) => (
            <motion.div 
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-accent/50 transition-colors hover:shadow-lg group"
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <span className="text-accent text-xs font-medium uppercase tracking-wider mb-4 block">
                  {article.category}
                </span>
                
                <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-8 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  <Link href={`/insights/${article.slug}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                    Read Article →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
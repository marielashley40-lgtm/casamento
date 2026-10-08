import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UtensilsCrossed, Wine, Coffee, Sparkles, Leaf } from 'lucide-react';

interface MenuItem {
  title: string;
  description: string;
  tags?: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  items: MenuItem[];
}

export const MenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('coquetel');

  const categories: MenuCategory[] = [
    {
      id: 'coquetel',
      name: 'Coquetel & Ilha',
      subtitle: 'Boas-vindas ao entardecer',
      icon: Sparkles,
      items: [
        {
          title: 'Bruschetta Rústica de Pomodorini',
          description: 'Pão de fermentação natural tostado, tomates confitados, pesto genovês de manjericão fresco e burrata cremosa.',
          tags: ['Vegetariano'],
        },
        {
          title: 'Dadinho de Tapioca com Geléia de Pimenta',
          description: 'Queijo coalho artesanal com crosta dourada e redução suave de pimenta dedo-de-moça e maracujá.',
          tags: ['Sem Glúten', 'Vegetariano'],
        },
        {
          title: 'Ceviche Clássico de Robalo & Manga',
          description: 'Cubos frescos marinados no leche de tigre cítrico, cebola roxa finamente fatiada e milho crocante.',
          tags: ['Sem Glúten'],
        },
        {
          title: 'Ramequim de Brie Quente com Mel & Nozes',
          description: 'Queijo brie derretido com favo de mel silvestre e castanhas tostadas sobre crisps de folhado.',
          tags: ['Vegetariano'],
        },
      ],
    },
    {
      id: 'principal',
      name: 'Pratos Principais',
      subtitle: 'Jantar empratado à la carte',
      icon: UtensilsCrossed,
      items: [
        {
          title: 'Medalhão de Filé Mignon ao Molho Roti',
          description: 'Corte nobre grelhado no ponto perfeito, acompanhado de mousseline aveludada de mandioquinha e legumes grelhados no tomilho.',
          tags: ['Sem Glúten'],
        },
        {
          title: 'Salmão Grelhado em Crosta de Ervas',
          description: 'Lombo de salmão fresco sobre leito de risoto al limone e emulsão de alcaparras e dill.',
          tags: ['Sem Glúten'],
        },
        {
          title: 'Risoto de Cogumelos Selvagens Trufados',
          description: 'Arroz arbóreo italiano, mix de shiitake, shimeji e cogumelo paris com azeite trufado e parmesão ralado na hora.',
          tags: ['Vegetariano', 'Sem Glúten'],
        },
        {
          title: 'Nhoque Artesanal de Abóbora Cabotiá (Opção Vegana)',
          description: 'Massa fresca sem ovos com molho pomodoro rústico, folhas de sálvia crocante e amêndoas laminadas tostadas.',
          tags: ['Vegano', 'Sem Lactose'],
        },
      ],
    },
    {
      id: 'sobremesas',
      name: 'Sobremesas & Doces',
      subtitle: 'Doces momentos de celebração',
      icon: Coffee,
      items: [
        {
          title: 'Mil-Folhas com Creme de Baunilha Bourbon',
          description: 'Camadas ultrafinas e crocantes de massa folhada caramelizada intercaladas com creme pâtissière leve.',
        },
        {
          title: 'Torta Ganache Belga 70% com Frutas Vermelhas',
          description: 'Chocolate nobre meio amargo com calda de framboesas e mirtilos frescos colhidos no dia.',
        },
        {
          title: 'Mesa de Doces Finos & Bem-Casados Tradicionais',
          description: 'Brigadeiros gourmet de pistache, camafeus de nozes, trufas de champanhe e os tradicionais bem-casados com recheio de doce de leite artesanal.',
        },
      ],
    },
    {
      id: 'bar',
      name: 'Bebidas & Bar',
      subtitle: 'Carta de vinhos e coquetelaria',
      icon: Wine,
      items: [
        {
          title: 'Espumante Brut & Vinhos Finos',
          description: 'Espumante de método tradicional para o brinde, além de rótulos selecionados de Cabernet Sauvignon e Sauvignon Blanc.',
        },
        {
          title: 'Drinks Autorais dos Noivos',
          description: 'O drink da noiva "Helena Spritz" (Aperol, espumante e toranja) e o drink do noivo "Gabriel’s Old Fashioned" (Bourbon, angostura e casca de laranja maçaricada).',
        },
        {
          title: 'Bar Sem Álcool & Mocktails Refrescantes',
          description: 'Sucos naturais da estação, água aromatizada com hortelã e frutas cítricas, sodas italianas e refrigerantes.',
        },
      ],
    },
  ];

  const activeCategory = categories.find((c) => c.id === selectedCategory) || categories[0];

  return (
    <section id="cardapio" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <span className="font-script text-3xl sm:text-4xl text-[#8a6b18] block mb-1">
          Menu Gastronômico
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c2725] tracking-tight">
          Cardápio de Sugestão
        </h2>
        <p className="text-sm text-[#736a64] mt-2 max-w-lg mx-auto">
          Preparado com carinho pelo nosso chef para agradar a todos os paladares.
          Caso tenha restrições ou alergias, informe no formulário de confirmação abaixo!
        </p>
        <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-3 rounded-full" />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2c2725] text-white shadow-sm'
                  : 'bg-white text-[#736a64] border border-[#ece3d8] hover:bg-[#faf8f5] hover:text-[#2c2725]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-[#8a6b18]'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Content */}
      <div className="bg-white rounded-2xl border border-[#ece3d8] shadow-xs p-6 sm:p-10 relative overflow-hidden">
        <div className="text-center mb-8 pb-4 border-b border-[#ece3d8]/60">
          <h3 className="text-2xl font-serif font-bold text-[#2c2725]">
            {activeCategory.name}
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#8a7e74] mt-1 font-medium">
            {activeCategory.subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            {activeCategory.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-4 rounded-xl bg-[#faf8f5]/60 border border-[#f0e8df] hover:border-[#e2d5c5] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-serif font-bold text-[#2c2725] text-base sm:text-lg">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-[#ece3d8]/60">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium"
                      >
                        <Leaf className="w-2.5 h-2.5 text-emerald-600" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

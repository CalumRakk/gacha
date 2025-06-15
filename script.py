import random


def invocar_item(items, rarezas, pity_activo=False):
    """
    Simula una invocación y retorna un ítem aleatorio.

    Args:
        items: Lista de diccionarios que representan los ítems.
        rarezas: Diccionario con las rarezas y sus probabilidades.
        pity_activo: Booleano que indica si el sistema de pity está activo.

    Returns:
        Un diccionario que representa el ítem obtenido.
    """

    if pity_activo:
        rareza_seleccionada = random.choices(
            ["Raro", "Épico"],
            weights=[0.90, 0.10], # 90% Raro, 10% Épico en Pity
            k=1
        )[0]
    else:
        # Seleccionar una rareza aleatoria basada en las probabilidades normales
        rareza_seleccionada = random.choices(
            list(rarezas.keys()),
            weights=list(rarezas.values()),
            k=1
        )[0]

    items_filtrados = [item for item in items if item["rareza"] == rareza_seleccionada]
    item_obtenido = random.choice(items_filtrados)
    return item_obtenido


def main():
    """
    Función principal del programa Gacha.
    """
    print("¡Bienvenido al Simulador Gacha!")

    items = [
        {"nombre": "Fragmento de Nada", "rareza": "Común", "sprite": "~~"},
        {"nombre": "Piedra Común", "rareza": "Común", "sprite": "o"},
        {"nombre": "Espada de Madera", "rareza": "Común", "sprite": "/\\"},
        {"nombre": "Escudo de Cuero", "rareza": "Común", "sprite": "[]"},
        {"nombre": "Poción Curativa Menor", "rareza": "Común", "sprite": "(+)"},
        {"nombre": "Daga Oxidada", "rareza": "Común", "sprite": "-'"},
        {"nombre": "Botas Usadas", "rareza": "Común", "sprite": "_|_"},
        {"nombre": "Casco Abollado", "rareza": "Común", "sprite": "∩"},
        {"nombre": "Flecha Perdida", "rareza": "Común", "sprite": "->"},
        {"nombre": "Anillo de Latón", "rareza": "Común", "sprite": "o-"},

        {"nombre": "Daga de Acero", "rareza": "Raro", "sprite": "-X-"},
        {"nombre": "Armadura de Mallas", "rareza": "Raro", "sprite": "#H#"},
        {"nombre": "Poción Curativa Mayor", "rareza": "Raro", "sprite": "(++)"},
        {"nombre": "Escudo Reforzado", "rareza": "Raro", "sprite": "[#]"},
        {"nombre": "Espada Larga", "rareza": "Raro", "sprite": "//="},

        {"nombre": "Espada Ancestral", "rareza": "Épico", "sprite": "*||=*"},
        {"nombre": "Cetro de Poder Arcano", "rareza": "Épico", "sprite": "*~|~*"},
        {"nombre": "Armadura de Dragón", "rareza": "Épico", "sprite": "<D>"},
    ]

    rarezas = {
        "Común": 0.89,  # 89%
        "Raro": 0.10,   # 10%
        "Épico": 0.01,  # 1%
    }

    gemas = 200
    costo_invocacion_x1 = 10
    costo_invocacion_x10 = 100
    inventario = []
    pity_contador = 0
    pity_maximo = 9 # Garantiza Raro o superior en la 10ª invocación si no ha salido antes

    while True:
        print(f"\n--- Banner Principal ---")
        print(f"Gemas: {gemas}")
        print(f"Pity: {pity_contador}/{pity_maximo} (para Raro o superior)")
        print("----------------------")
        print("1. Invocar x1 (Cuesta 10 gemas)")
        print("2. Invocar x10 (Cuesta 100 gemas)")
        print("3. Salir")

        opcion = input("Elige una opción: ")

        if opcion == "1":
            if gemas >= costo_invocacion_x1:
                gemas -= costo_invocacion_x1
                item_obtenido = None # Inicializar

                if pity_contador >= pity_maximo:
                    print("¡PITY ACTIVADO! ¡Obtienes un objeto Raro o superior garantizado!")
                    item_obtenido = invocar_item(items, rarezas, pity_activo=True)
                    pity_contador = 0
                else:
                    item_obtenido = invocar_item(items, rarezas)

                print(f"Has invocado: {item_obtenido['nombre']} ({item_obtenido['rareza']}) - {item_obtenido['sprite']}")
                inventario.append(item_obtenido)

                if item_obtenido['rareza'] == "Común":
                    pity_contador += 1
                else: # Raro o Épico
                    print(f"¡Obtuviste un {item_obtenido['rareza']}! Pity reseteado.")
                    pity_contador = 0
            else:
                print("No tienes suficientes gemas para una invocación.")

        elif opcion == "2": # Invocar x10
            if gemas >= costo_invocacion_x10:
                gemas -= costo_invocacion_x10
                print("\n--- Resultados de Invocación x10 ---")
                items_obtenidos_x10 = []
                pity_activado_en_multi = False

                for i in range(10):
                    item_obtenido = None # Inicializar
                    if pity_contador >= pity_maximo:
                        if not pity_activado_en_multi: # Mostrar el mensaje de pity solo una vez por multi
                             print("¡PITY ACTIVADO DURANTE MULTI-INVOCACIÓN! ¡Garantizado Raro o superior!")
                             pity_activado_en_multi = True
                        item_obtenido = invocar_item(items, rarezas, pity_activo=True)
                        pity_contador = 0 # Se resetea inmediatamente
                    else:
                        item_obtenido = invocar_item(items, rarezas)

                    items_obtenidos_x10.append(item_obtenido)
                    inventario.append(item_obtenido)

                    # Actualizar pity DESPUÉS de obtener el item y ANTES de la siguiente iteración
                    if item_obtenido['rareza'] == "Común":
                        pity_contador += 1
                    else: # Raro o Épico
                        if not pity_activado_en_multi or item_obtenido['rareza'] == "Épico": # Evita doble mensaje si el pity ya saltó
                            print(f"¡En la invocación {i+1}/10 obtuviste un {item_obtenido['rareza']}! Pity reseteado.")
                        pity_contador = 0 # Se resetea si sale Raro o Épico
                        pity_activado_en_multi = False # Permite que el mensaje de pity pueda volver a salir si hay otro pity en la misma multi

                # Mostrar los resultados
                for i, item in enumerate(items_obtenidos_x10):
                    print(f"Tirada {i+1}: {item['nombre']} ({item['rareza']}) - {item['sprite']}")
                print("---------------------------------")

            else:
                print("No tienes suficientes gemas para 10 invocaciones.")

        elif opcion == "3":
            break
        else:
            print("Opción inválida.")

    print("\n¡Gracias por jugar! Has terminado con el siguiente inventario conceptual:")
    # Mostrar inventario al final
    # for i, item in enumerate(inventario):
    # print(f"Item {i+1}: {item['nombre']} ({item['rareza']})")


if __name__ == "__main__":
    main()